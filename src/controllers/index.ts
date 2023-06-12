import { Router } from 'express'

import { NotFoundError } from '../error/NotFoundError'

import { errorHandler } from './error'
import { usersRouter } from './users'

export const rootRouter = Router()

// Configure all controllers' routes
rootRouter.use('/api/users', usersRouter)

// Configure 404 handler
rootRouter.use((req, res, next) => {
  const err = new NotFoundError()
  next(err)
})

// Configure error handler
rootRouter.use(errorHandler)
