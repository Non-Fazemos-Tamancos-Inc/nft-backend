import { json as jsonBodyParser } from 'body-parser'
import cors from 'cors'
import { Router } from 'express'

import { NotFoundError } from '../error/NotFoundError'

import { collectionsRouter } from './collections'
import { errorHandler } from './error'
import { nftsRouter } from './nfts'
import { purchasesRouter } from './purchases'
import { uploadsRouter } from './uploads'
import { usersRouter } from './users'

export const rootRouter = Router()

// Configure CORS
rootRouter.use(cors())

// Parse body
rootRouter.use(jsonBodyParser())

// Uploads
rootRouter.use('/uploads', uploadsRouter)

// Configure all controllers' routes
rootRouter.use('/api/users', usersRouter)
rootRouter.use('/api/purchases', purchasesRouter)
rootRouter.use('/api/nfts', nftsRouter)
rootRouter.use('/api/collections', collectionsRouter)

// Configure 404 handler
rootRouter.use((req, res, next) => {
  const err = new NotFoundError()
  next(err)
})

// Configure error handler
rootRouter.use(errorHandler)
