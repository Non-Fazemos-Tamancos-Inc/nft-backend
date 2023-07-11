import mongoose from 'mongoose'
import userSchema from '../schemas/user.js'

const User = mongoose.model('User', userSchema)

let sampleUsers = [
  new User({
    name: 'Rafael Zimmer',
    email: 'rzimmerdev@gmail.com',
    username: 'rzimmerdev',
    password_hash: '$2y$10$2dnWpNucmgHtJQFv3aT9.u4btAyRNzUiopEk1gW2x.WarS9jCqKFi', // 123
  }),
  new User({
    name: 'Adalton Silva',
    email: 'adalton@usp.br',
    username: 'adartu',
    password_hash: '$2y$10$ty4MUtH/8zDtKJXgDzIxaOksb9UcVWzprTA8eZMRQJb6/yXHLxThG', // 321
  }),
  new User({
    name: 'Lelis Amilton',
    email: 'lelis@domain.io',
    username: 'lelis',
    password_hash: '$2y$10$A5xrVWGiU85iwKcovATaw.9TQKqpDwxweY6pBT//4ZhuT2F.4fvES', // 111
  }),
]

async function createUsers() {
  for (let user of sampleUsers) {
    await user.save()
  }
}

export default createUsers
export { sampleUsers }
