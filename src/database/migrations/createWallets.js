import mongoose from 'mongoose'
import walletSchema from '../schemas/wallet.js'
import { sampleCollections } from './createCollections.js'
import { sampleNfts } from './createNfts.js'

const Wallet = mongoose.model('Wallet', walletSchema)

let sampleWallets = [
  new Wallet({
    hash: '111',
    owner: 'rzimmerdev',
    individualNfts: [sampleNfts[0]],
  }),
  new Wallet({
    hash: '112',
    owner: 'lelis',
    collections: [sampleCollections[1]],
  }),
]

async function createWallets() {
  for (let wallet of sampleWallets) {
    await wallet.save()
  }
}

export default createWallets
export { sampleWallets }
