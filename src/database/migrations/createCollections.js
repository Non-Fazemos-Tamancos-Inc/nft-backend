import mongoose from 'mongoose'

import { sampleNfts } from './createNfts.js'
import collectionSchema from '../schemas/collection.js'

const Collection = mongoose.model('Collection', collectionSchema)

let sampleCollections = [
  new Collection({
    name: 'Extraterrestrial',
    hash: '111',
    creator: 'rzimmerdev',
    nfts: [sampleNfts[0], sampleNfts[1]],
  }),
  new Collection({
    name: 'Fantasy',
    hash: '112',
    creator: 'lelis',
    nfts: [sampleNfts[2]],
  }),
  new Collection({
    name: 'Secret Collection',
    hash: '113',
    creator: 'adartu',
    nfts: [],
  }),
]

async function createCollections() {
  for (let collection of sampleCollections) {
    await collection.save()
  }
}

export default createCollections
export { sampleCollections }
