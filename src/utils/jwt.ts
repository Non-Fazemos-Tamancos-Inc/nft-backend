import { sign, verify } from 'jsonwebtoken'

import { configs } from '../configs/configs'
import { logger } from '../configs/logger'
import { JWTError, JWTErrorKind } from '../error/JWTError'
import { User, UserRole } from '../model/User'

export interface JWTPayload {
  id: string
  email: string
  role: UserRole
}

export function generateJWT(user: User): string {
  if (user._id == null) {
    throw new JWTError(JWTErrorKind.Signing)
  }

  try {
    const payload: JWTPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    }

    return sign({ payload }, configs.secret, {
      algorithm: 'HS512',
      subject: user._id.toString(),
      expiresIn: '12h',
    })
  } catch (e) {
    logger.error(e, `Failed to sign JWT for user ${user._id}`)
    throw new JWTError(JWTErrorKind.Signing, { cause: e })
  }
}

export function checkJWT(token: string): JWTPayload {
  try {
    const result = verify(token, configs.secret, {
      algorithms: ['HS512'],
    })

    if (typeof result !== 'object') {
      throw new Error('Invalid parsing result')
    }

    return result.payload
  } catch (e) {
    throw new JWTError(JWTErrorKind.Checking, { cause: e })
  }
}
