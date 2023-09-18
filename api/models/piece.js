const mongoose = require('mongoose')

const Piece = mongoose.model('Piece', {
  date: Date,
  reference: String,
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total: Number,
  actions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    date: Date
  }]
})

module.exports = { Piece }
