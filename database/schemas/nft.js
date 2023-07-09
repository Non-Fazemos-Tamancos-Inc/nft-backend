import mongoose from "mongoose";

const nftSchema = new mongoose.Schema({
    name: String,
    hash: String,
    creator: String,
    src: String,
});

export default nftSchema;