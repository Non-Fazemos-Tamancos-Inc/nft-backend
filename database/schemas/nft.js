const mongoose = require('mongoose');
const crypto = require("crypto");

const nftSchema = new mongoose.Schema({
    name: String,
    hash: {
        type: String,
        unique: true
    },
    creator: String,
    on_market: {
        type: Boolean,
        default: false
    }
});

nftSchema.methods.set_hash = async function (content) {
    this.hash = crypto.createHash('sha256').update(content).digest('hex');
    return this.hash;
};

module.exports = mongoose.model('Nft', nftSchema);