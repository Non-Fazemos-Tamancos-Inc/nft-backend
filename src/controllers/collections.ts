import { Router } from 'express'

import { ApiError } from '../error/ApiError'
import { CollectionModel, collectionToResponse } from '../model/Collection'
import { NFTModel, nftToResponse } from '../model/NFT'
import { UserRole } from '../model/User'
import { asyncHandler } from '../utils/asyncHandler'
import { handleAuthorization } from '../utils/auth'

export const collectionsRouter = Router()

export const RELEASE_THRESHOLD = 7 * 24 * 60 * 60 * 1000 // 7 days

// Get all collections
collectionsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    let authInfo = null

    try {
      authInfo = handleAuthorization(req)
    } catch (_e) {
      // Ignore error
    }

    let collections = await CollectionModel.find({})

    // Filter only released collections & near releases for non-admin users
    if (authInfo == null || authInfo.role !== UserRole.Admin) {
      const threshold = Date.now() + RELEASE_THRESHOLD
      collections = collections.filter(
        (collection) => collection.releaseDate.getTime() < threshold,
      )
    }

    // Build response
    res.status(200)
    res.json({
      collections: collections.map((c) => collectionToResponse(c)),
    })
  }),
)

// Get a collection
collectionsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    let authInfo = null

    try {
      authInfo = handleAuthorization(req)
    } catch (_e) {
      // Ignore error
    }

    const { id } = req.params

    const collection = await CollectionModel.findById(id)

    if (collection == null) {
      throw new ApiError('Collection not found', { status: 404 })
    }

    // Check if collection is released or near release
    if (authInfo == null || authInfo.role !== UserRole.Admin) {
      const threshold = Date.now() + RELEASE_THRESHOLD
      if (collection.releaseDate.getTime() >= threshold) {
        throw new ApiError('Collection not found', { status: 404 })
      }
    }

    // Load NFTs
    const nfts = await NFTModel.find({ collectionId: collection._id })

    // Build response
    res.status(200)
    res.json({
      collection: collectionToResponse(collection, nfts.map(nftToResponse)),
    })
  }),
)

// Create a collection
collectionsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const { name, description, image, releaseDate } = req.body

    const collection = await CollectionModel.create({
      name,
      description,
      releaseDate,
      image,
    })

    // Build response
    res.status(201)
    res.json({
      collection: collectionToResponse(collection),
    })
  }),
)

// Update a collection
collectionsRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const { id } = req.params
    const { name, description, image, releaseDate } = req.body

    let collection = await CollectionModel.findByIdAndUpdate(id, {
      name,
      description,
      image,
      releaseDate,
      updatedAt: new Date(),
    })

    if (collection == null) {
      throw new ApiError('Collection not found', { status: 404 })
    }

    collection = await CollectionModel.findById(id)

    // Build response
    res.status(200)
    res.json({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      collection: collectionToResponse(collection!),
    })
  }),
)

// Delete a collection
collectionsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const { id } = req.params
    const collection = await CollectionModel.findByIdAndDelete(id)

    if (collection == null) {
      throw new ApiError('Collection not found', { status: 404 })
    }

    // Build response
    res.status(200)
    res.json({
      collection: collectionToResponse(collection),
    })
  }),
)
