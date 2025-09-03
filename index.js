const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const Order = require('./models/Order');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // important for JSON APIs
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// --- Simple Admin Authentication ---
const adminAuth = (req, res, next) => {
  const auth = req.query.key;
  if (auth === 'secret123') next();
  else res.send('Unauthorized');
};

// --- Admin Panel ---
app.get('/admin', adminAuth, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  const orders = await Order.find().sort({ createdAt: -1 });
  res.render('admin', { products, orders });
});

app.post('/admin/products', adminAuth, async (req, res) => {
  const { name, price, description, image } = req.body;
  const newProduct = new Product({ name, price, description, image });
  await newProduct.save();
  res.redirect('/admin?key=secret123');
});

app.post('/admin/orders/:id', adminAuth, async (req, res) => {
  const { status } = req.body;
  await Order.findByIdAndUpdate(req.params.id, { status });
  res.redirect('/admin?key=secret123');
});

// --- API ROUTES (for frontend) ---
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/orders', async (req, res) => {
  const { customerName, email, products, total } = req.body;
  const newOrder = new Order({ customerName, email, products, total });
  await newOrder.save();
  res.json({ message: 'Order saved', order: newOrder });
});

// --- Default route ---
app.get('/', (req, res) => res.send('Backend is running with Admin + API!'));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
