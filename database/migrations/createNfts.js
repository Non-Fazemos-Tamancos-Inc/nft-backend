import mongoose from 'mongoose';
import nftSchema from "../schemas/nft.js";

const Nft = mongoose.model("Nft", nftSchema);

let sampleNfts = [
    new Nft({
        name: "Super Animal",
        hash: "111",
        creator: 'rzimmerdev',
        src: "animals",
    }),
    new Nft({
        name: "Astronaut",
        hash: "112",
        creator: 'adartu',
        src: "space",
    }),
    new Nft({
        name: "Wild West",
        hash: "113",
        creator: 'adartu',
        src: "fantasy",
    })
]

async function createNfts() {
    for (let nft of sampleNfts) {
        await nft.save();
    }
}

export default createNfts;
export { sampleNfts };