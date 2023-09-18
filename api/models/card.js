const mongoose = require('mongoose')
const CardSchema = new mongoose.Schema({
  id: Number,
  credit_card_number: String,
  credit_card_expiry_date: String,
  credit_card_type: String
})
CardSchema.methods.toJSON = function () {
  const card = this
  const cardObject = card.toObject()
  delete cardObject.credit_card_number
  return cardObject
}
const Card = mongoose.model('Card', CardSchema)

module.exports = { Card }
