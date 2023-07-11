import { randomInt } from 'crypto'

import { Router } from 'express'

import { logger } from '../configs/logger'
import { ApiError } from '../error/ApiError'
import { NFTModel } from '../model/NFT'
import { Purchase, PurchaseModel, PurchaseStatus, purchaseToResponse } from '../model/Purchase'
import { UserModel, UserRole } from '../model/User'
import { asyncHandler } from '../utils/asyncHandler'
import { handleAuthorization } from '../utils/auth'

export const purchasesRouter = Router()

// Get all purchases of a user
purchasesRouter.get(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    let { userId } = req.params

    if (userId === 'me') {
      userId = authInfo.id
    }

    if (authInfo.role !== UserRole.Admin && authInfo.id !== req.params.userId) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await UserModel.findById(userId)!
    } catch (e) {
      throw new ApiError('User not found', { status: 404 })
    }

    const purchases = await PurchaseModel.find({ userId: req.params.userId })

    // Build response
    res.status(200)
    res.json({
      purchases: purchases.map((purchase) => purchaseToResponse(purchase)),
    })
  }),
)

// Get a purchase

purchasesRouter.get(
  '/single/:id',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    const { id } = req.params

    const purchase = await PurchaseModel.findById(id)

    if (
      purchase == null ||
      (authInfo.role !== UserRole.Admin && authInfo.id !== purchase.userId)
    ) {
      throw new ApiError('Purchase not found', { status: 404 })
    }

    // Build response
    res.status(200)
    res.json({
      purchase: purchaseToResponse(purchase),
    })
  }),
)

// List purchases

purchasesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const purchases = await PurchaseModel.find({})

    res.status(200)
    res.json({
      purchases: purchases.map((purchase) => purchaseToResponse(purchase)),
    })
  }),
)

// Create a purchase
interface CreatePurchaseBody {
  nfts?: string[]
  paymentMethod?: string

  cardInfo?: {
    cardNumber: string
    cardHolder: string
    expirationDate: string
    cvv: string
  }
}

purchasesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    const { nfts, paymentMethod, cardInfo }: CreatePurchaseBody = req.body

    if (nfts == null || nfts.length === 0) {
      throw new ApiError('No nft provided', { status: 400 })
    }

    const actualNfts = await Promise.all(
      nfts.map(async (nft) => {
        const actualNft = await NFTModel.findById(nft)
        if (actualNft == null) {
          throw new ApiError('NFT not found', { status: 404 })
        }

        // Check for non-cancelled purchases
        const purchases = await PurchaseModel.find({
          nftId: actualNft._id,
          status: { $ne: PurchaseStatus.CANCELLED },
        })

        if (purchases.length > 0) {
          throw new ApiError(
            `NFT ${actualNft._id} - ${actualNft.name} is not available for purchase`,
            { status: 400 },
          )
        }

        return actualNft
      }),
    )

    if (paymentMethod !== 'card' && paymentMethod !== 'crypto') {
      throw new ApiError('Invalid payment method', { status: 400 })
    }

    if (paymentMethod === 'card' && cardInfo == null) {
      throw new ApiError('No card info provided', { status: 400 })
    }

    const purchases: Purchase[] = []

    // Handle card payment
    if (paymentMethod === 'card') {
      if (!/\d{12,16}/.test(cardInfo?.cardNumber?.trim() || '')) {
        throw new ApiError('Invalid card number', { status: 400 })
      }

      if (!/^[a-zA-Z ]+$/.test(cardInfo?.cardHolder?.trim() || '')) {
        throw new ApiError('Invalid card holder', { status: 400 })
      }

      if (!/^\d{2}\/\d{2}$/.test(cardInfo?.expirationDate?.trim() || '')) {
        throw new ApiError('Invalid expiration date', { status: 400 })
      }

      // Check if expiration date is in the future
      let month: string | number | undefined
      let year: string | number | undefined
      try {
        ;[month, year] = cardInfo?.expirationDate?.trim().split('/') || []
      } catch (e) {
        throw new ApiError('Invalid expiration date', { status: 400 })
      }

      if (month == null || year == null) {
        throw new ApiError('Invalid expiration date', { status: 400 })
      }
      const expirationDate = new Date(2000 + parseInt(year), parseInt(month) - 1).getTime()
      if (expirationDate < new Date().getTime()) {
        throw new ApiError('Card expired', { status: 400 })
      }

      if (!/\d{3}/.test(cardInfo?.cvv?.trim() || '')) {
        throw new ApiError('Invalid cvv', { status: 400 })
      }

      for (const nft of actualNfts) {
        const purchase = new PurchaseModel({
          userId: authInfo.id,
          nftId: nft.id,
          status: PurchaseStatus.COMPLETED,
        })
        await purchase.save()
        purchases.push(purchase)

        await NFTModel.updateOne({ _id: nft._id }, { sold: true })
      }
    }
    // Handle crypto payment
    else {
      for (const nft of actualNfts) {
        const purchase = new PurchaseModel({
          userId: authInfo.id,
          nftId: nft.id,
          status: PurchaseStatus.PENDING,
        })
        await purchase.save()
        purchases.push(purchase)
      }

      // Simulate crypto payment
      setTimeout(async () => {
        const rng = randomInt(0, 100)
        let status = PurchaseStatus.COMPLETED
        if (rng < 10) {
          status = PurchaseStatus.CANCELLED
        }

        for (const purchase of purchases) {
          purchase.status = status
          await PurchaseModel.updateOne({ _id: purchase._id }, { status })

          if (status === PurchaseStatus.COMPLETED) {
            await NFTModel.updateOne({ _id: purchase.nftId }, { sold: true })
          }
        }
      }, 15000)
    }

    // Build response
    res.status(200)
    res.json({
      purchases: purchases.map((purchase) => purchaseToResponse(purchase)),
    })
  }),
)

// Mark a purchase as sent

purchasesRouter.put(
  '/:id/sent',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const { id } = req.params

    const purchase = await PurchaseModel.findById(id)

    if (purchase == null) {
      throw new ApiError('Purchase not found', { status: 404 })
    }

    purchase.sentAt = new Date()
    await purchase.save()

    res.status(200)
    res.json({
      purchase: purchaseToResponse(purchase),
    })
  }),
)

// Unmark a purchase as sent

purchasesRouter.delete(
  '/:id/sent',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const { id } = req.params

    const purchase = await PurchaseModel.findById(id)

    if (purchase == null) {
      throw new ApiError('Purchase not found', { status: 404 })
    }

    purchase.sentAt = undefined
    await purchase.save()

    res.status(200)
    res.json({
      purchase: purchaseToResponse(purchase),
    })
  }),
)

// Cancel a purchase

purchasesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const authInfo = handleAuthorization(req)

    if (authInfo.role !== UserRole.Admin) {
      throw new ApiError('You shall not pass', { status: 403 })
    }

    const { id } = req.params
    let purchase = await PurchaseModel.findById(id)

    if (purchase == null) {
      throw new ApiError('Purchase not found', { status: 404 })
    }

    purchase.status = PurchaseStatus.CANCELLED
    await purchase.save()

    await NFTModel.updateOne({ _id: purchase.nftId }, { sold: false })

    purchase = await PurchaseModel.findById(id)

    res.status(200)
    res.json({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      purchase: purchaseToResponse(purchase!),
    })
  }),
)

export async function recoverPurchases() {
  const purchases = await PurchaseModel.find({
    status: PurchaseStatus.PENDING,
  })

  logger.debug(`Recovering ${purchases.length} purchases`)

  for (const purchase of purchases) {
    const rng = randomInt(0, 100)
    let status = PurchaseStatus.COMPLETED
    if (rng < 10) {
      status = PurchaseStatus.CANCELLED
    }

    await PurchaseModel.updateOne({ _id: purchase._id }, { status })

    if (status === PurchaseStatus.COMPLETED) {
      await NFTModel.updateOne({ _id: purchase.nftId }, { sold: true })
    }
  }
}
