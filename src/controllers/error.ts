import { NextFunction, Request, Response } from 'express'

import { logger } from '../configs/logger'
import { ApiError } from '../error/ApiError'
import { ErrorResponse } from '../model/Error'

const DEFAULT_ERROR_MESSAGE = 'Something went wrong :('

export function errorHandler(
  err: unknown,
  req: Request<never, never, never, never, never>,
  res: Response<ErrorResponse, never>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): undefined {
  // Handle API errors
  if (err instanceof ApiError) {
    logger.warn(err, `Handling API error at "${req.url}": ${err.status} - ${err.message}`)

    const payload: ErrorResponse = {
      message: err.message || DEFAULT_ERROR_MESSAGE,
    }

    res.status(err.status)
    res.json(payload)
    return
  }

  // Handle unknown errors
  logger.error(err, `Handling unexpected error`)
  res.status(500)
  res.json({ message: DEFAULT_ERROR_MESSAGE })
}
