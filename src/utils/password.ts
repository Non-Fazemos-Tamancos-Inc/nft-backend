import { compare, genSalt, hash } from 'bcryptjs'

import { logger } from '../configs/logger'

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt()
  logger.info({ password })
  return await hash(password, salt)
}

export async function checkPassword(password: string, passwordHash: string): Promise<boolean> {
  logger.info({ password, passwordHash })
  return await compare(password, passwordHash)
}
