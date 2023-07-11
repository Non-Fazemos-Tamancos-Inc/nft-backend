const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const nftRouter = express.Router()
const Nft = require('../database/schemas/nft')
// const Collection = require('../../database/schemas/collection');

const storage = multer.memoryStorage()
const upload = multer({ storage })

nftRouter.get('/', async (req, res) => {
  try {
    const nfts = await Nft.find()

    const nftPaths = nfts.map((nft) => {
      const src = `${nft.hash}.jpg`
      return {
        ...nft.toJSON(),
        src,
      }
    })

    res.json(nftPaths)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

nftRouter.get('/:hash', async (req, res) => {
  try {
    const { hash } = req.params

    let nft = await Nft.findOne({ hash })

    if (nft) {
      const imagePath = `${nft.hash}.jpg`
      nft = { ...nft.toJSON(), imagePath }
      res.json(nft)
    } else {
      res.status(404).json({ message: 'NFT not found' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

nftRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, creator, price } = req.body
    const { buffer } = req.file

    if (!buffer) {
      return res.status(400).json({ message: 'Image file is required' })
    }

    const nft = new Nft({
      name,
      creator,
      price,
    })

    nft.set_hash(buffer)

    const filename = `${nft.hash}.jpg`
    const imagePath = path.join(__dirname, '../..', 'content', 'nft', filename)

    fs.writeFileSync(imagePath, buffer)

    const newNft = await nft.save()
    res.status(201).json(newNft)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

nftRouter.delete('/:hash', async (req, res) => {
  try {
    const deletedNft = await Nft.findOneAndDelete({ hash: req.params.hash })
    if (deletedNft) {
      res.json({ message: 'Nft deleted' })
    } else {
      res.status(404).json({ message: 'Nft not found' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = nftRouter
