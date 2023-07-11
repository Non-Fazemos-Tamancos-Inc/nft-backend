import { model, Schema } from 'mongoose'

import { EMAIL_REGEX } from '../utils/validators/email'

/* eslint-disable no-unused-vars */
export enum UserRole {
  Customer = 'CUSTOMER',
  Admin = 'ADMIN',
}

/* eslint-enable no-unused-vars */

export interface User {
  _id?: string | unknown
  name: string
  email: string
  password: string
  wallet?: string
  role: UserRole
  active?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface UserResponse {
  _id: string
  name: string
  email: string
  wallet?: string
  role: UserRole
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

export const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: EMAIL_REGEX,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    type: String,
  },
  role: {
    type: String,
    enum: [UserRole.Customer, UserRole.Admin],
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export const UserModel = model('User', UserSchema)

export const userToResponse = (user: User): UserResponse => ({
  _id: user._id?.toString() || '',
  name: user.name,
  email: user.email,
  wallet: user.wallet,
  role: user.role,
  active: user.active || false,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})
