import mongoose from "mongoose";
import collectionSchema from "./collection.js";
import nftSchema from "./nft.js";

const cartSchema = new mongoose.Schema({
    owner: String,
    individualNfts: [nftSchema],
    collections: [collectionSchema],
});

export default cartSchema;
