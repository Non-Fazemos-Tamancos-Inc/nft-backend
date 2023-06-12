import { ApiError, ApiErrorOptions } from './ApiError'

export class AuthenticationFailedError extends ApiError {
  constructor(
    msg = 'authentication failed',
    { status = 401, ...options }: ApiErrorOptions = {},
  ) {
    super(msg, { status, ...options })
  }
}
