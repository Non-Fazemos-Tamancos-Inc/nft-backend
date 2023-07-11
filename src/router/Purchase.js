const express = require('express')

// const Session = require('../../database/schemas/session');
const Wallet = require('../database/schemas/wallet')
const Cart = require('../database/schemas/cart')

const purchaseRouter = express.Router()

purchaseRouter.post('/', async (req, res) => {
  try {
    const { buyerUsername, sellerUsername } = req.body

    // Find the buyer's wallet
    const buyerWallet = await Wallet.findOne({ owner: buyerUsername })
    if (!buyerWallet) {
      return res.status(404).json({ message: 'Buyer wallet not found' })
    }

    // Find the seller's wallet
    const sellerWallet = await Wallet.findOne({ owner: sellerUsername })
    if (!sellerWallet) {
      return res.status(404).json({ message: 'Seller wallet not found' })
    }

    // Find the buyer's cart
    const buyerCart = await Cart.findOne({ owner: buyerUsername })
    if (!buyerCart) {
      return res.status(404).json({ message: 'Buyer cart not found' })
    }

    // Perform purchase logic here...
    // Deduct the amount from the buyer's wallet, add it to the seller's wallet, update inventory, etc.

    // Clear the buyer's cart
    buyerCart.items = []
    await buyerCart.save()

    res.json({ message: 'Purchase successful' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = purchaseRouter
