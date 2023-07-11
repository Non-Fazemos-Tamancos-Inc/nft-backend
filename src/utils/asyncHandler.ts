/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  NextFunction,
  ParamsDictionary,
  Request,
  RequestHandler,
  Response,
} from 'express-serve-static-core'
import { ParsedQs } from 'qs'

export interface AsyncRequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  LocalsObj extends Record<string, any> = Record<string, any>,
  PromiseRes = any,
> {
  (
    req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
    res: Response<ResBody, LocalsObj>,
    next: NextFunction,
  ): Promise<PromiseRes>
}

/**
 * Fix the way express handles async errors
 */
export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
