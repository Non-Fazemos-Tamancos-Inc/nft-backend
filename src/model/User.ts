import { ObjectId, Schema, model } from 'mongoose'

import { EMAIL_REGEX } from '../utils/validators/email'

/* eslint-disable no-unused-vars */
export enum UserRole {
  Customer = 'CUSTOMER',
  Admin = 'ADMIN',
}
/* eslint-enable no-unused-vars */

export interface User {
  _id?: string | ObjectId
  name: string
  email: string
  password: string
  wallet?: string
  role: UserRole
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
})

export const UserModel = model('User', UserSchema)
