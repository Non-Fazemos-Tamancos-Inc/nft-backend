const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
  name: String,
  hash: String,
  creator: String,
  nfts: [],
  on_market: Boolean,
})

module.exports = mongoose.model('Collection', collectionSchema)