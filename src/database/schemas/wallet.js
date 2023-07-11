const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
  hash: String,
  owner: String,
  individualNfts: [],
  collections: [],
})

module.exports = mongoose.model('Wallet', walletSchema)
