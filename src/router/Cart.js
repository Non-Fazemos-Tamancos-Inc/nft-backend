const express = require('express')

const Cart = require('../database/schemas/cart')
// const Nft = require('../../database/schemas/nft');
const Session = require('../database/schemas/session')

const cartRouter = express.Router()

cartRouter.delete('/', async (req, res) => {
  try {
    const { session_id } = req.headers
    let session = Session.findOne({ session_id })

    if (!session) {
      return res.status(401).json({ message: 'Invalid session' })
    }

    const cart = await Cart.findOne({ owner: session.username })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = []
    await cart.save()

    res.json({ message: 'Cart cleared successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

cartRouter.post('/collections', async (req, res) => {
  try {
    const { session_id } = req.headers
    const { collection } = req.body
    let session = Session.findOne({ session_id })

    if (!session) {
      return res.status(401).json({ message: 'Invalid session' })
    }

    const cart = await Cart.findOne({ owner: session.username })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items.push(collection)
    await cart.save()

    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

cartRouter.post('/nfts', async (req, res) => {
  try {
    const { session_id } = req.headers
    const { nft } = req.body
    let session = Session.findOne({ session_id })

    if (!session) {
      return res.status(401).json({ message: 'Invalid session' })
    }
    const cart = await Cart.findOne({ owner: session.username })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items.push(nft)
    await cart.save()

    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = cartRouter
