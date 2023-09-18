const mongoose = require('mongoose')

const Product = mongoose.model('Product', {
  productName: {
    type: String,
    unique: true,
    required: true
  },

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  purchasePrice: Number,
  sellingPrice: Number,
  code: {
    type: String,
    required: true,
    unique: true
  },
  reference: String,
  image: String,
  actions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    date: Date
  }]
})

module.exports = { Product }
