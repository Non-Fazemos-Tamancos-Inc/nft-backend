const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const nftRouter = require('./router/Nft');
const userRouter = require('./router/User');
const sessionRouter = require('./router/Session');
const purchaseRouter = require('./router/Purchase');
const walletRouter = require('./router/Wallet');
const cartRouter = require('./router/Cart');

mongoose.connect('mongodb://127.0.0.1:27017/local');

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

const apiRouter = express.Router();
apiRouter.use('/nft', nftRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/session', sessionRouter);
apiRouter.use('/purchase', purchaseRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/wallet', walletRouter);

app.use("/api", apiRouter);

app.listen(8000, () => {
    console.log('Server started on port 8000');
});
