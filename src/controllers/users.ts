import { Router } from 'express'

import { ApiError } from '../error/ApiError'
import { AuthenticationFailedError } from '../error/AuthenticationFailedError'
import { NotFoundError } from '../error/NotFoundError'
import { User, UserModel, UserRole } from '../model/User'
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
      throw new ApiError('email and password are required')
    }

    // Validate email and password types (avoid NoSQL injection)
    if (!(typeof email === 'string') || !(typeof password === 'string')) {
      throw new ApiError('email and password are expected to be strings')
    }

    // Search for user with the given e-mail
    const foundUser: User | null = await UserModel.findOne({ email })

    if (foundUser == null) {
      throw new AuthenticationFailedError()
    }

    // Validate password
    const passwordMatches = await checkPassword(password, foundUser.password)
    if (!passwordMatches) {
      throw new AuthenticationFailedError()
    }

    // Build token
    const jwtToken = generateJWT(foundUser)

    // Respond successful login
    res.json({ token: jwtToken })
  }),
)

// Signup route //

usersRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    // Extract payload
    const { name, email, password, wallet } = req.body

    // Validate payload
    validateUserPayload({ name, email, password, wallet }, false)

    // Build new user
    const newUser = await UserModel.create({
      name,
      email,
      password: await hashPassword(password),
      role: UserRole.Customer,
      wallet,
    })

    if (newUser == null) {
      throw new ApiError('failed to save user', { status: 500 })
    }

    // Create JWT for new user
    const token = generateJWT({ ...newUser, _id: newUser._id.toString() } as User)

    // Build response
    res.status(201)
    res.json({ token })
  }),
)

// Update User //

usersRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    const { id } = req.params
    const { name, email, password, wallet } = req.body

    // Restrict update to self, unless admin
    if (authInfo.id !== id && authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    // Validate payload
    validateUserPayload({ id, name, email, password, wallet }, true)

    // Update user
    const updatePayload: UserPayload = {}

    if (name != null) {
      updatePayload.name = name
    }
    if (email != null) {
      updatePayload.email = email
    }
    if (password != null) {
      updatePayload.password = await hashPassword(password)
    }
    if (wallet != null) {
      updatePayload.wallet = wallet
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updatePayload)

    // Most likely case is not found, but can be other error
    if (updatedUser == null) {
      throw new ApiError('user not found', { status: 404 })
    }

    // Build response
    res.status(200)
    res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        wallet: updatedUser.wallet,
        role: updatedUser.role,
      },
    })
  }),
)

// Retrieve User //

usersRouter.get(
  '/:id?',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    let { id } = req.params

    // Handle self-retrieval
    if (id == null || id === '' || id === 'me') {
      id = authInfo.id
    }

    // Restrict update to self, unless admin
    if (authInfo.id !== id && authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    // Retrieve user
    const foundUser = await UserModel.findById(id)

    // Most likely case is not found, but can be other error
    if (foundUser == null) {
      throw new NotFoundError('user not found', { status: 404 })
    }

    // Build response
    res.status(200)
    res.json({
      user: {
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        wallet: foundUser.wallet,
        role: foundUser.role,
      },
    })
  }),
)
