import { model, Schema } from 'mongoose'

import { NFTResponse } from './NFT'

export interface Collection {
  _id?: string | unknown
  name: string
  description: string
  image?: string

  createdAt?: Date
  updatedAt?: Date

  releaseDate?: Date
}

export interface CollectionResponse {
  _id: string
  name: string
  description: string
  image?: string
  releaseDate?: Date

  nfts?: NFTResponse[]
}

export const CollectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
})

export const CollectionModel = model('Collection', CollectionSchema)

export function collectionToResponse(
  collection: Collection,
  nfts?: NFTResponse[],
): CollectionResponse {
  return {
    _id: collection._id?.toString() || '',
    name: collection.name,
    description: collection.description,
    image: collection.image,
    releaseDate: collection.releaseDate,
    nfts,
  }
}
