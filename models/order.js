const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  products: [{ name: String, price: Number, quantity: Number }],
  total: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
