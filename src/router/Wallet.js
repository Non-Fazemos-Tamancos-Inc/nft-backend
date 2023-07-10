const express = require('express');
const Wallet = require('../../database/schemas/wallet');

const walletRouter = express.Router();

// walletRouter.post('/:wallet/nft', async (req, res) => {
//     try {
//         const { walletId } = req.params;
//         const { nftId } = req.body;
//
//         const wallet = await Wallet.findById(walletId);
//
//         if (!wallet) {
//             return res.status(404).json({ message: 'Wallet not found' });
//         }
//
//         wallet.individualNfts.push(nftId);
//
//         const updatedWallet = await wallet.save();
//
//         res.json(updatedWallet);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

walletRouter.get('/:owner', async (req, res) => {
    try {
        const { owner } = req.params;

        const wallet = await Wallet.findOne({ owner });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        res.json(wallet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// walletRouter.delete('/:wallet/nft/:nft', async (req, res) => {
//     try {
//         const { walletId, nftId } = req.params;
//
//         const wallet = await Wallet.findById(walletId);
//
//         if (!wallet) {
//             return res.status(404).json({ message: 'Wallet not found' });
//         }
//
//         wallet.individualNfts = wallet.individualNfts.filter((id) => id !== nftId);
//
//         const updatedWallet = await wallet.save();
//
//         res.json(updatedWallet);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

module.exports = walletRouter;
