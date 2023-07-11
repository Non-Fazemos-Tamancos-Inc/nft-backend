/**
 * TODO: handle concurrent transactions
 */
import { model, Schema } from 'mongoose'

export interface NFT {
  _id?: string | unknown
  collectionId: string
  name: string
  description?: string
  image?: string
  price: number

  createdAt?: Date
  updatedAt?: Date

  sold: boolean // Pre-calculated sold status to reduce DB queries
}

export interface NFTResponse {
  _id: string
  collectionId: string
  name: string
  description?: string
  image?: string
  price: number
  sold: boolean
}

export const NFTSchema = new Schema({
  collectionId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  sold: {
    type: Boolean,
    default: false,
  },
})

export const NFTModel = model('NFT', NFTSchema)

export function nftToResponse(nft: NFT): NFTResponse {
  return {
    _id: nft._id?.toString() || '',
    collectionId: nft.collectionId,
    name: nft.name,
    description: nft.description,
    image: nft.image,
    price: nft.price,
    sold: nft.sold,
  }
}
