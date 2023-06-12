import { exit } from 'process'

import express from 'express'

import { configs } from './configs/configs'
import { logger } from './configs/logger'
import { connect } from './configs/mongoose'
import { rootRouter } from './controllers'

export const app = express()

// Server initializer
async function init() {
  // Register root router
  app.use(rootRouter)

  // Configure MongoDB
  try {
    await connect()
  } catch (e) {
    logger.error(e, 'Failed to connect to MongoDB')
    throw e
  }

  // Spin up server
  app.listen(configs.port, configs.host, () => {
    logger.info(`Express server listening on http://${configs.host}:${configs.port}`)
  })
}

// Initialize server
init().catch((e) => {
  logger.error(e, `Server failed to start`)
  exit(1)
})
