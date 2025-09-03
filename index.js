const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const Order = require('./models/Order');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Setup view engine and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// Simple admin authentication
const adminAuth = (req, res, next) => {
  const auth = req.query.key;
  if (auth === 'secret123') next();
  else res.status(401).send('Unauthorized');
};

// Admin panel
app.get('/admin', adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('admin', { products, orders });
  } catch (err) {
    res.status(500).send('Error loading admin panel');
  }
});

// Add product
app.post('/admin/products', adminAuth, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const newProduct = new Product({ name, price, description, image });
    await newProduct.save();
    res.redirect('/admin?key=secret123');
  } catch (err) {
    res.status(500).send('Error adding product');
  }
});

// Update order status
app.post('/admin/orders/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin?key=secret123');
  } catch (err) {
    res.status(500).send('Error updating order');
  }
});

// Public test route
app.get('/', (req, res) => {
  res.send('✅ Backend is running! Visit /admin?key=secret123 for admin panel');
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin?key=secret123');
  } catch (err) {
    res.status(500).send('Error updating order');
  }
});

// Public test route
app.get('/', (req, res) => {
  res.send('✅ Backend is running! Visit /admin?key=secret123 for admin panel');
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));  await newProduct.save();
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
