const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password_hash: String,
});

userSchema.methods.createHash = async function (plainTextPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltRounds);
};

userSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = mongoose.model('User', userSchema);