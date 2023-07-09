import mongoose from "mongoose";
import nftSchema from './nft.js';

const collectionSchema = new mongoose.Schema({
    name: String,
    hash: String,
    creator: String,
    nfts: [nftSchema],
});

export default collectionSchema;