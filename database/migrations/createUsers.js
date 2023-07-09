import mongoose from 'mongoose';
import userSchema from "../schemas/user.js";

const User = mongoose.model("User", userSchema);

let sampleUsers = [
    new User({
        name: "Rafael Zimmer",
        email: "rzimmerdev@gmail.com",
        username: "rzimmerdev",
        passwordHash: "321"
    }),
    new User({
        name: "Adalton Silva",
        email: "adalton@usp.br",
        username: "adartu",
        passwordHash: "123"
    }),
    new User({
        name: "Lelis Amilton",
        email: "lelis@domain.io",
        username: "lelis",
        passwordHash: "111"
    })
]

async function createUsers() {
    for (let user of sampleUsers) {
        await user.save();
    }
}

export default createUsers;
export { sampleUsers };