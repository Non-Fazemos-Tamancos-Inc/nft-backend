import { model, Schema } from 'mongoose'

export interface Upload {
  _id?: string | unknown
  filename: string
  uri: string
  createdAt?: Date
}

export interface UploadResponse {
  _id: string
  filename: string
  uri: string
  createdAt?: Date
}

export const UploadSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const UploadModel = model('Upload', UploadSchema)

export function uploadToResponse(upload: Upload): UploadResponse {
  return {
    _id: upload._id?.toString() || '',
    filename: upload.filename,
    uri: upload.uri,
    createdAt: upload.createdAt,
  }
}
