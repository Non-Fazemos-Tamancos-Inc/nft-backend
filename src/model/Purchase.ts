import { model, Schema } from 'mongoose'

/* eslint-disable no-unused-vars */
export enum PurchaseStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/* eslint-enable no-unused-vars */

export interface Purchase {
  _id?: string | unknown
  nftId: string
  userId: string
  status: PurchaseStatus
  sentAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface PurchaseResponse {
  _id: string
  nftId: string
  userId: string
  status: PurchaseStatus
  sentAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export const PurchaseSchema = new Schema({
  nftId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [PurchaseStatus.PENDING, PurchaseStatus.COMPLETED, PurchaseStatus.CANCELLED],
    required: true,
  },
  sentAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export const PurchaseModel = model('Purchase', PurchaseSchema)

export function purchaseToResponse(purchase: Purchase): PurchaseResponse {
  return {
    _id: purchase._id?.toString() || '',
    nftId: purchase.nftId,
    userId: purchase.userId,
    status: purchase.status,
    sentAt: purchase.sentAt,
    createdAt: purchase.createdAt,
    updatedAt: purchase.updatedAt,
  }
}
