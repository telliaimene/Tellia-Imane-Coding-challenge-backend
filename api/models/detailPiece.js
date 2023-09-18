const mongoose = require('mongoose')

const DetailPiece = mongoose.model('DetailPiece', {

  product: {
    name: String,
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  },
  piece: { type: mongoose.Schema.Types.ObjectId, ref: 'Piece' },
  quantity: {
    type: Number,
    required: true,
    min: 0

  },
  unitpriceHT: Number

})

module.exports = { DetailPiece }
