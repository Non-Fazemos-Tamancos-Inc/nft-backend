import mongoose from 'mongoose'

import { configs } from './configs'
import { logger } from './logger'

export async function connect() {
  const { mongoUri } = configs

  logger.debug(`Connecting to MongoDB with URI: "${mongoUri}"`)

  return await mongoose.connect(mongoUri)
}
