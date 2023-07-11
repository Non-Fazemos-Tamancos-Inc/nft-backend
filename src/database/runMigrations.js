import mongoose from 'mongoose'
import createUsers from './migrations/createUsers.js'
import createNfts from './migrations/createNfts.js'
import createCollections from './migrations/createCollections.js'
import createWallets from './migrations/createWallets.js'

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/local')
    console.log('Connected to MongoDB...')
    await mongoose.connection.db.dropDatabase()
    console.log('Cleaning existing collections')

    await createUsers()
    console.log('Created users.')

    await createNfts()
    console.log('Created nft.')

    await createCollections()
    console.log('Created collections.')

    await createWallets()
    console.log('Created wallets.')
  } catch (error) {
    console.error('Error creating users:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB.')
  }
}

await main()
