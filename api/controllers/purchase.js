const { Product } = require('../models/product')
const { DetailPiece } = require('../models/detailPiece')
const { Piece } = require('../models/piece')
const { Card } = require('../models/card')
const request = require('request')
const { openConnection, closeConnection, is_connected } = require('../helpers/database.js')

function PurchaseProduct (req, res) {
  openConnection()
  const piece = new Piece()
  piece.date = req.body.date
  piece.reference = req.body.reference
  piece.client = req.body.client
  piece.total = req.body.total
  const detailData = []
  piece.save().then(result => {
    req.body.product?.map(item => {
      const data = new DetailPiece({
        product: { id: item.id, name: item.name },
        quantity: item.quantity,
        unitpriceHT: item.unitpriceHT,
        piece: result._id
      })
      detailData.push(data)
      Product.findById(item.id).then(product => {
        if (product == null) {
          res.status(200).json({
            message: 'List of products is empty'
          })
        } else {
          product.quantity = product.quantity - item.quantity
          product.save()
        }
      })
      return detailData
    })
    res.status(200).json({ result, detailData })
  }).catch(err => {
    res.status(300).json(err)
  })
  if (is_connected) closeConnection()
}
async function PurchaseProductStats (req, res) {
  openConnection()
  const purchase_trends = await DetailPiece.aggregate([
    {
      $unwind: {
        path: '$product'
      }
    },
    {
      $group: {
        _id: '$product.id',
        title: {
          $first: '$product.name'
        },
        existenceNumber: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        existenceNumber: -1
      }
    }

  ])
  const top_selling = await DetailPiece.aggregate([
    {
      $unwind: {
        path: '$product'
      }
    },
    {
      $group: {
        _id: '$product.id',
        title: {
          $first: '$product.name'
        },
        totalQuanityVente: {
          $sum: '$quantity'
        }
      }
    },
    {
      $sort: {
        totalQuanityVente: -1
      }
    }

  ])
  const total = await DetailPiece.aggregate([
    {
      $unwind: {
        path: '$product'
      }
    },
    {
      $group: {
        _id: '$product.id',
        title: {
          $first: '$product.name'
        },
        totalSaleAmount:
                {
                  $sum:
                    {
                      $multiply: ['$unitpriceHT', '$quantity']
                    }
                }
      }
    },
    {
      $sort: {
        totalSaleAmount: -1
      }
    }

  ])

  res.status(200).json({ purchase_trends, top_selling, total })
  if (is_connected) closeConnection()
}

function PostDataRandom (req, res) {
  const options = {
    method: 'GET',
    url: 'https://random-data-api.com/api/v2/credit_cards?size=100',
    headers:
            { 'Content-Type': 'application/json' },
    json: true
  }
  openConnection()
  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    body.forEach(item => {
      const data = new Card({
        id: item.id,
        credit_card_number: item.credit_card_number,
        credit_card_expiry_date: item.credit_card_expiry_date,
        credit_card_type: item.credit_card_type
      })
      data.save()
    })
    res.status(200).json('sucees')
  })
}
function GetDataRandom (req, res) {
  openConnection()

  Card.find({ credit_card_type: 'visa' }, (err, cards) => {
    if (err) {
      res.status(300).json(err)
    } else if (cards.length === 0) {
      res.status(200).json({
        message: 'List of cards is empty'
      })
    } else {
      const result = []
      cards?.map(card => {
        const data = {
          ExpiryDate: card.credit_card_expiry_date,
          idCard: card.id
        }
        result.push(data)
        return result
      })
      res.status(200).json(result)
    }
  })
  if (is_connected) closeConnection()
}

module.exports = {
  PurchaseProduct,
  PurchaseProductStats,
  PostDataRandom,
  GetDataRandom

}
