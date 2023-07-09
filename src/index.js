const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://127.0.0.1:27017/local');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:8000'
}));

app.get('/', (req, res) => {
    res.json({"available_routes": ["products"]})
});

app.post('/products', (req, res) => {
    let { name, _, description, price, quantity } = req.body;

    let slug = "/products/" + name;

    const product = new Product({
        name,
        description,
        price,
        quantity,
    });

    product.save()
        .then((result) => {
            res.status(201).json(result);
            console.log("Product created");
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: error });
        });
});

app.get('/products/:name', (req, res) => {
    const { name } = req.params;
    Product.findOne({ name })
        .then((product) => {
            if (product) {
                res.json(product);
                console.log("Product found");
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Unable to fetch product' });
        });
});

app.put('/products/:name', (req, res) => {
    const { name } = req.params;
    const { description, price, quantity } = req.body;
    Product.findOneAndUpdate({ name }, { description, price, quantity }, { new: true })
        .then((product) => {
            if (product) {
                res.json(product);
                console.log("Product updated");
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Unable to update product' });
        });
});

app.delete('/products/:name', (req, res) => {
    const { name } = req.params;

    console.log(name);
    Product.findOneAndDelete({ name })
        .then((product) => {
            if (product) {
                res.json({ message: 'Product deleted successfully' });
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Unable to delete product' });
        });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
