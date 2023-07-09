import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    passwordHash: String,
});

export default userSchema;