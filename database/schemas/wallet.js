import mongoose from "mongoose";
import collectionSchema from "./collection.js";
import nftSchema from "./nft.js";

const walletSchema = new mongoose.Schema({
    hash: String,
    owner: String,
    individualNfts: [nftSchema],
    collections: [collectionSchema],
});

export default walletSchema;
