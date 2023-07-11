import { Router } from 'express'

import { ApiError } from '../error/ApiError'
import { CollectionModel } from '../model/Collection'
import { NFTModel, nftToResponse } from '../model/NFT'
import { UserRole } from '../model/User'
import { asyncHandler } from '../utils/asyncHandler'
import { handleAuthorization } from '../utils/auth'

import { RELEASE_THRESHOLD } from './collections'

export const nftsRouter = Router()

// Get all nfts of a collection
nftsRouter.get(
  '/collection/:collectionId',
  asyncHandler(async (req, res) => {
    let authInfo = null

    try {
      authInfo = handleAuthorization(req)
    } catch (_e) {
      // Ignore error
    }

    const collections = await CollectionModel.findById(req.params.collectionId)

    // Check if collection exists and is released
    if (collections == null || authInfo == null || authInfo.role !== UserRole.Admin) {
      const threshold = Date.now() + RELEASE_THRESHOLD
      if (collections == null || collections.releaseDate.getTime() > threshold) {
        throw new ApiError('Collection not found', { status: 404 })
      }
    }

    const nfts = await NFTModel.find({ collectionId: req.params.collectionId })

    // Build response
    res.status(200)
    res.json({
      nfts: nfts.map(nftToResponse),
    })
  }),
)

// Get a nft

nftsRouter.get(
  '/single/:id',
  asyncHandler(async (req, res) => {
    let authInfo = null

    try {
      authInfo = handleAuthorization(req)
    } catch (_e) {
      // Ignore error
    }

    const { id } = req.params

    const nft = await NFTModel.findById(id)

    if (nft == null) {
      throw new ApiError('NFT not found', { status: 404 })
    }

    // Check if collection exists and is released
    if (authInfo == null || authInfo.role !== UserRole.Admin) {
      const threshold = Date.now() + RELEASE_THRESHOLD
      const collection = await CollectionModel.findById(nft.collectionId)
      if (collection == null || collection.releaseDate.getTime() > threshold) {
        throw new ApiError('Collection not found', { status: 404 })
      }
    }

    // Build response
    res.status(200)
    res.json({
      nft: nftToResponse(nft),
    })
  }),
)

// Create a nft

nftsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const { name, description, image, collectionId, price } = req.body

    const nft = await NFTModel.create({
      collectionId,
      name,
      description,
      image,
      price,
      sold: false,
    })

    res.status(201)
    res.json({
      nft: nftToResponse(nft),
    })
  }),
)

// Update a nft

nftsRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const { id } = req.params

    const { name, description, image, price } = req.body

    let nft = await NFTModel.findByIdAndUpdate(id, {
      name,
      description,
      image,
      price,
    })

    if (nft == null) {
      throw new ApiError('NFT not found', { status: 404 })
    }

    nft = await NFTModel.findById(id)

    res.status(200)
    res.json({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      nft: nftToResponse(nft!),
    })
  }),
)

// Delete a nft

nftsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const { id } = req.params

    const nft = await NFTModel.findByIdAndDelete(id)

    if (nft == null) {
      throw new ApiError('NFT not found', { status: 404 })
    }

    res.status(200)
    res.json({
      nft: nftToResponse(nft),
    })
  }),
)
