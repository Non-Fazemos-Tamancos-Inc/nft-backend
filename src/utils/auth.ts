import { Request } from 'express'

import { AuthenticationFailedError } from '../error/AuthenticationFailedError'

import { checkJWT, JWTPayload } from './jwt'

export function handleAuthorization(req: Request): JWTPayload {
  const authorizationHeader = req.headers.authorization

  if (authorizationHeader == null) {
    throw new AuthenticationFailedError()
  }

  const splitHeader = authorizationHeader.split(' ')
  const token = splitHeader[splitHeader.length - 1]

  const payload = checkJWT(token)
  return payload
}
