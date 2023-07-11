import { ApiError, ApiErrorOptions } from './ApiError'

export class NotFoundError extends ApiError {
  constructor(msg = 'Not found', { status = 404, ...options }: ApiErrorOptions = {}) {
    super(msg, { status, ...options })
  }
}
