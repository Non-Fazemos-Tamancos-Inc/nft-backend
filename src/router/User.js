const express = require('express')

const userRouter = express.Router()

const User = require('../database/schemas/user')
const Session = require('../database/schemas/session')
const Wallet = require('../database/schemas/wallet')

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find()
    const usernames = users.map((user) => user.username)
    res.json(usernames)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

userRouter.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
  })

  const wallet = new Wallet({
    owner: req.body.username,
    individualNfts: [],
    collections: [],
  })

  try {
    user.password_hash = await user.createHash(req.body.password)

    const newUser = await user.save()
    const newWallet = await wallet.save()

    res.status(201).json({ newUser, newWallet })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

userRouter.get('/:username', async (req, res) => {
  try {
    const { username } = req.params
    const { session_id } = req.headers

    if (!session_id || !Session.findOne(session_id)) {
      return res.status(401).json({ message: 'Invalid sessionId' })
    }

    const user = await User.findOne({ username }).select('-password_hash')
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

userRouter.put('/:username', async (req, res) => {
  try {
    const { username } = req.params
    const { password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
    }

    if (!(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    const updatedUser = await user.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

userRouter.delete('/:username', async (req, res) => {
  try {
    const { username } = req.params
    const { password } = req.body

    const user = await User.findOne({ username: username })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
    }

    if (!(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const deletedUser = await User.findOneAndDelete({ username: username })
    if (deletedUser) {
      res.json({ message: 'User deleted' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = userRouter
