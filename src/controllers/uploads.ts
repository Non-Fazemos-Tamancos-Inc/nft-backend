import { randomUUID } from 'crypto'
import path from 'path'

import { Router, static as expressStatic } from 'express'
import multer, { diskStorage } from 'multer'

import { configs } from '../configs/configs'
import { ApiError } from '../error/ApiError'
import { UploadModel } from '../model/Upload'
import { UserRole } from '../model/User'
import { asyncHandler } from '../utils/asyncHandler'
import { handleAuthorization } from '../utils/auth'

const DEST_DIR = path.resolve(path.join(configs.uploadPath, 'files'))
const uploads = multer({
  storage: diskStorage({
    destination: DEST_DIR,
    filename: (_req, file, cb) => {
      cb(null, `${randomUUID()}${path.extname(file.originalname)}`)
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 50, // 50MB
  },
})

export const uploadsRouter = Router()

uploadsRouter.post(
  '/',
  asyncHandler(async (req, res, next) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    next()
  }),
  uploads.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError('No file uploaded', { status: 400 })
    }

    const filename = req.file.filename

    if (!filename) {
      throw new ApiError('No file uploaded', { status: 400 })
    }

    const upload = await UploadModel.create({
      filename,
      uri: `/uploads/files/${filename}`,
    })

    res.status(200)
    res.json({
      upload: {
        id: upload.id,
        filename: upload.filename,
        uri: upload.uri,
      },
    })
  }),
)

uploadsRouter.use('/files', expressStatic(DEST_DIR))
