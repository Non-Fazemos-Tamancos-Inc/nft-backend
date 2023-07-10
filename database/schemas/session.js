const mongoose = require('mongoose');
const crypto = require("crypto");

const sessionSchema = new mongoose.Schema({
    session_id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
});

sessionSchema.methods.set_id = async function (password) {
    const secret = `${this.username}:${password}:${Date.now()}`;
    this.session_id = crypto.createHash('sha256').update(secret).digest('hex');
    return this.session_id;
};

module.exports = mongoose.model('Session', sessionSchema);