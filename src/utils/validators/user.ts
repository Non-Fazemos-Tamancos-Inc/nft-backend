import { ObjectId } from 'mongoose'

import { ApiError } from '../../error/ApiError'
import { UserModel } from '../../model/User'

import { isEmailValid } from './email'
import { isPasswordValid } from './password'

export interface UserPayload {
  id?: string | ObjectId
  name?: string
  email?: string
  password?: string
  wallet?: string
  active?: boolean
  updatedAt?: Date
}

export async function validateUserEmail(
  email?: string,
  id?: string | ObjectId,
  optional = false,
) {
  // Handle null case
  if (email == null) {
    if (!optional) {
      throw new ApiError('email is required', { status: 400 })
    }
    return
  }

  // Check type
  if (typeof email !== 'string') {
    throw new ApiError('email must be a string', { status: 400 })
  }

  // Validate email format
  if (!isEmailValid(email)) {
    throw new ApiError('email is invalid', { status: 400 })
  }

  // Search for conflicting email (emails must be unique)
  const userMatch = await UserModel.findOne({ email })
  if (userMatch != null && userMatch._id.toString() !== id?.toString()) {
    throw new ApiError('email already registered', { status: 400 })
  }
}

export async function validateUserPassword(password?: string, optional = false) {
  // Handle null case
  if (password == null) {
    if (!optional) {
      throw new ApiError('password is required', { status: 400 })
    }
    return
  }

  // Check type
  if (typeof password !== 'string') {
    throw new ApiError('password must be a string', { status: 400 })
  }

  // Validate password format
  if (!isPasswordValid(password)) {
    throw new ApiError('password is invalid', { status: 400 })
  }
}

export async function validateUserName(name?: string, optional = false) {
  // Handle null case
  if (name == null) {
    if (!optional) {
      throw new ApiError('name is required', { status: 400 })
    }
    return
  }

  // Check type
  if (typeof name !== 'string') {
    throw new ApiError('name must be a string', { status: 400 })
  }
}

export async function validateUserWallet(wallet?: string, optional = false) {
  // Handle null case
  if (wallet == null) {
    if (!optional) {
      throw new ApiError('wallet is required', { status: 400 })
    }
    return
  }

  // Check type
  if (typeof wallet !== 'string') {
    throw new ApiError('wallet must be a string', { status: 400 })
  }
}

export async function validateUserPayload(
  { id, email, name, password, wallet }: UserPayload,
  optional = false,
) {
  await validateUserEmail(email, id, optional)
  await validateUserPassword(password, optional)
  await validateUserName(name, optional)
  await validateUserWallet(wallet, true) // Wallet is always optional
}
