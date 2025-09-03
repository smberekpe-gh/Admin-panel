const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const Order = require('./models/Order');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// simple admin authentication
const adminAuth = (req, res, next) => {
  const auth = req.query.key;
  if(auth === 'secret123') next();
  else res.send('Unauthorized');
};

// admin panel
app.get('/admin', adminAuth, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  const orders = await Order.find().sort({ createdAt: -1 });
  res.render('admin', { products, orders });
});

// add product
app.post('/admin/products', adminAuth, async (req, res) => {
  const { name, price, description, image } = req.body;
  const newProduct = new Product({ name, price, description, image });
  await newProduct.save();
  res.redirect('/admin?key=secret123');
});

// update order status
app.post('/admin/orders/:id', adminAuth, async (req, res) => {
  const { status } = req.body;
  await Order.findByIdAndUpdate(req.params.id, { status });
  res.redirect('/admin?key=secret123');
});

// test route
app.get('/', (req, res) => res.send('Backend is running!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
