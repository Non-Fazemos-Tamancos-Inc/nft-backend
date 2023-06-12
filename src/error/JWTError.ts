import { ApiError, ApiErrorOptions } from './ApiError'

/* eslint-disable no-unused-vars */
export enum JWTErrorKind {
  Signing,
  Checking,
}
/* eslint-enable no-unused-vars */

export class JWTError extends ApiError {
  constructor(kind = JWTErrorKind.Checking, options: ApiErrorOptions = {}) {
    let status = 401
    let message = 'Invalid JWT'

    if (kind === JWTErrorKind.Signing) {
      status = 500
      message = 'Failed to sign JWT'
    }

    super(message, { status, ...options })
  }
}
