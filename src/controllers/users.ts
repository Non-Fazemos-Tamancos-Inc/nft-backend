import { Router } from 'express'

import { ApiError } from '../error/ApiError'
import { AuthenticationFailedError } from '../error/AuthenticationFailedError'
import { NotFoundError } from '../error/NotFoundError'
import { User, UserModel, UserRole, userToResponse } from '../model/User'
import { asyncHandler } from '../utils/asyncHandler'
import { handleAuthorization } from '../utils/auth'
import { generateJWT } from '../utils/jwt'
import { checkPassword, hashPassword } from '../utils/password'
import { UserPayload, validateUserPayload } from '../utils/validators/user'

export const usersRouter = Router()

// Login route //

usersRouter.put(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check for fields
    if (email == null || password == null) {
      throw new ApiError('email and password are required', { status: 400 })
    }

    // Validate email and password types (avoid NoSQL injection)
    if (!(typeof email === 'string') || !(typeof password === 'string')) {
      throw new ApiError('email and password are expected to be strings', { status: 400 })
    }

    // Search for user with the given e-mail
    const foundUser: User | null = await UserModel.findOne({ email })

    if (foundUser == null || foundUser.active === false) {
      throw new AuthenticationFailedError('User not found or inactive')
    }

    // Validate password
    const passwordMatches = await checkPassword(password, foundUser.password)
    if (!passwordMatches) {
      throw new AuthenticationFailedError('Password does not match')
    }

    // Build token
    const jwtToken = generateJWT(foundUser)

    // Respond successful login
    res.json({
      user: userToResponse(foundUser),
      token: jwtToken,
    })
  }),
)

// Signup route //

usersRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    let authInfo = null

    try {
      authInfo = handleAuthorization(req)
    } catch (_e) {
      // Ignore error
    }

    // Extract payload
    const { name, email, password, wallet, admin } = req.body || {}

    // Validate payload
    await validateUserPayload({ name, email, password, wallet }, false)

    // Build new user
    const newUser = await UserModel.create({
      name,
      email,
      password: await hashPassword(password),
      wallet,
      role: authInfo?.role === UserRole.Admin && admin ? UserRole.Admin : UserRole.Customer,
      active: true,
    })

    if (newUser == null) {
      throw new ApiError('failed to save user', { status: 500 })
    }

    // Create JWT for new user
    const token = generateJWT({ ...newUser, _id: newUser._id.toString() } as User)

    // Build response
    res.status(201)
    res.json({
      user: userToResponse(newUser),
      token,
    })
  }),
)

// Update User //

usersRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    let { id } = req.params
    const { name, email, password, wallet, active, admin } = req.body

    if (id === 'me') {
      id = authInfo.id
    }

    // Restrict update to self, unless admin
    if (authInfo.id !== id && authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    // Validate payload
    await validateUserPayload({ id, name, email, password, wallet }, true)

    // Update user
    const updatePayload: UserPayload = {
      updatedAt: new Date(),
    }

    if (name != null) {
      updatePayload.name = name
    }
    if (email != null) {
      updatePayload.email = email
    }
    if (password != null) {
      updatePayload.password = await hashPassword(password)
    }
    if (wallet !== undefined) {
      updatePayload.wallet = wallet
    }
    if (active != null) {
      updatePayload.active = active
    }
    if (authInfo.role === UserRole.Admin && admin != null) {
      if (authInfo.id === id && !admin) {
        throw new ApiError('You cannot unmake yourself an admin', { status: 400 })
      }
      updatePayload.role = admin ? UserRole.Admin : UserRole.Customer
    }

    let updatedUser = await UserModel.findByIdAndUpdate(id, updatePayload)
    if (updatedUser == null) {
      throw new ApiError('User not found', { status: 404 })
    }

    updatedUser = await UserModel.findById(id)

    // Build response
    res.status(200)
    res.json({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      user: userToResponse(updatedUser!),
    })
  }),
)

// Retrieve User //

usersRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    let { id } = req.params

    // Handle self-retrieval
    if (id == null || id === '' || id === 'me') {
      id = authInfo.id
    }

    // Restrict retrieval to self, unless admin
    if (authInfo.id !== id && authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    // Retrieve user
    const foundUser = await UserModel.findById(id)

    // The most likely case is not found, but can be other errors
    if (foundUser == null) {
      throw new NotFoundError('User not found', { status: 404 })
    }

    // Build response
    res.status(200)
    res.json({
      user: userToResponse(foundUser),
    })
  }),
)

// List Users //

usersRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const users = await UserModel.find({})

    res.status(200)
    res.json({
      users: users.map(userToResponse),
    })
  }),
)

// Deactivate User //

usersRouter.delete(
  '/:id/activate',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    if (req.params.id === authInfo.id) {
      throw new ApiError('You cannot deactivate yourself', { status: 403 })
    }

    let updatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
      active: false,
      updatedAt: new Date(),
    })

    if (updatedUser == null) {
      throw new NotFoundError('User not found', { status: 404 })
    }

    updatedUser = await UserModel.findById(req.params.id)

    res.status(200)
    res.json({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      user: userToResponse(updatedUser!),
    })
  }),
)

// Activate User //

usersRouter.put(
  '/:id/activate',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    if (req.params.id === authInfo.id) {
      throw new ApiError('You cannot activate yourself', { status: 403 })
    }

    let updatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
      active: true,
      updatedAt: new Date(),
    })

    if (updatedUser == null) {
      throw new NotFoundError('User not found', { status: 404 })
    }

    updatedUser = await UserModel.findById(req.params.id)

    res.status(200)
    res.json({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      user: userToResponse(updatedUser!),
    })
  }),
)
