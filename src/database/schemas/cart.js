const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  owner: String,
  individualNfts: [],
  collections: [],
})

module.exports = mongoose.model('Cart', cartSchema)
