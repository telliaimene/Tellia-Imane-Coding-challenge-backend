const mongoose = require('mongoose')

const Category = mongoose.model('Category', {
  entitled: String,
  actions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    date: Date
  }]
})

module.exports = { Category }
