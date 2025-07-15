// models/Mobile.js
const mongoose = require('mongoose');

const mobileSchema = new mongoose.Schema({
  imageUrls: { type: [String], required: true },
  imagePublicIds: { type: [String], required: true },

  brand: { type: String, required: true },
  model: { type: String, required: true },
  ram: String,
  storage: String,

  retailPrice: { type: Number, required: true },
  dealerPrice: { type: Number, required: true },

  color: String,
  mobileId: { type: String, unique: true },

  deviceType: {
    type: String,
    enum: ['Mobile', 'Tablet'],
    default: 'Mobile',
  },
  networkType: {
    type: String,
    enum: ['5G', '4G', '3G', '2G'],
    default: '4G',
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mobile', mobileSchema);
