import dotenv from 'dotenv'

// Load .env configs :)
dotenv.config()

// Build configs object
export const configs = {
  host: process.env.EXPRESS_HOST || '127.0.0.1',
  port: parseInt(process.env.EXPRESS_PORT || '3000'),
  mongoUri: process.env.EXPRESS_MONGO_URI || 'mongodb://localhost:27017/nft-db',
  secret:
    process.env.EXPRESS_SECRET ||
    '06308ff30ff3b390acf2357b440171cd798a1fd549f06eb0825bbcee99e74619f47d14dfbbffa38921a833f251dba05766d98119d7357cde1447186f45169500',
  uploadPath: process.env.EXPRESS_UPLOAD_PATH || '/tmp/nft-uploads',
}
