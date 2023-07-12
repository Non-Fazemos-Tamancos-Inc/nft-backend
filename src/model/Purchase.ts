import { model, Schema } from 'mongoose'

import { NFTResponse } from './NFT'
import { UserResponse } from './User'

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
  price?: number
}

export interface PurchaseResponse {
  _id: string
  nftId: string
  userId: string
  status: PurchaseStatus
  sentAt?: Date
  createdAt?: Date
  updatedAt?: Date
  price?: number

  buyer?: UserResponse
  nft?: NFTResponse
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
  price: {
    type: Number,
    required: true,
  },
})

export const PurchaseModel = model('Purchase', PurchaseSchema)

export function purchaseToResponse(
  purchase: Purchase,
  buyer?: UserResponse,
  nft?: NFTResponse,
): PurchaseResponse {
  return {
    _id: purchase._id?.toString() || '',
    nftId: purchase.nftId,
    userId: purchase.userId,
    status: purchase.status,
    sentAt: purchase.sentAt,
    createdAt: purchase.createdAt,
    updatedAt: purchase.updatedAt,
    price: purchase.price,

    buyer,
    nft,
  }
}
