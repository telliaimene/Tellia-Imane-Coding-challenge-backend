const { Product } = require('../models/product')
const { Category } = require('../models/category')
const { openConnection, closeConnection, is_connected } = require('../helpers/database.js')

function searchProducts (req, res) {
  const query = req.swagger.params.search.value
  openConnection()
  Product.find({
    $or: [
      { productName: new RegExp(query, 'i') },
      { code: new RegExp(query, 'i') },
      { reference: new RegExp(query, 'i') }
    ]
  }, (err, products) => {
    if (err) {
      res.status(300).json(err)
    } else {
      if (products.length === 0) {
        res.status(200).json({
          message: 'List of products is empty'
        })
      } else {
        res.status(200).json(products)
      }
    }
  }).populate('category')
  if (is_connected) closeConnection()
}

function getProducts (req, res) {
  openConnection()

  Product.find({}, (err, products) => {
    if (err) {
      res.status(300).json(err)
    } else if (products.length === 0) {
      res.status(200).json({
        message: 'List of products is empty'
      })
    } else {
      res.status(200).json(products)
    }
  }).populate('category')

  if (is_connected) closeConnection()
}
async function getProductsPagination (req, res) {
  const page = req.swagger.params.page.value
  const limit = req.swagger.params.limit.value

  const products = await Product.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec()
  if (products.length === 0) {
    res.status(200).json({
      message: 'List of products is empty'
    })
  } else {
    const count = await Product.count()
    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  }
  if (is_connected) closeConnection()
}
function addProduct (req, res) {
  openConnection()

  const product = new Product()
  product.productName = req.body.productName
  product.category = req.body.category
  product.quantity = req.body.quantity
  product.purchasePrice = req.body.purchasePrice
  product.sellingPrice = req.body.sellingPrice
  product.code = req.body.code
  product.reference = req.body.reference
  if (req.files.image) {
    product.image = req.files.image[0].path
  }
  product.actions.push({
    user: req.body.action.user,
    action: 'Add',
    date: req.body.action.date
  })
  product.save().then(result => {
    res.status(200).json(result)
  }).catch(err => {
    res.status(300).json(err)
  })

  if (is_connected) closeConnection()
}

function setProduct (req, res) {
  const id = req.swagger.params.id.value
  openConnection()

  Product.findById(id, (err, product) => {
    if (err) {
      res.status(300).json(err)
    } else if (product === null) {
      res.status(404).json({
        message: 'product not found'
      })
    } else {
      product.productName = req.body.productName
      product.category = req.body.category
      product.quantity = req.body.quantity
      product.purchasePrice = req.body.purchasePrice
      product.sellingPrice = req.body.sellingPrice
      product.code = req.body.code
      product.reference = req.body.reference
      if (req.files.image) {
        product.image = req.files.image[0].path
      }
      // let action = JSON.parse(req.body.action)
      product.actions.push({
        user: req.body.action.user,
        action: 'Update',
        date: req.body.action.date
      })
      product.save().then(result => {
        res.status(200).json(result)
      }).catch(err => {
        res.status(300).json(err)
      })
    }
  })

  if (is_connected) closeConnection()
}
function getProduct (req, res) {
  const id = req.swagger.params.id.value

  openConnection()

  Product.findById(id).populate('category').then(product => {
    if (product == null) {
      res.status(200).json({
        message: 'List of products is empty'
      })
    } else {
      res.status(200).json(product)
    }
  })
  if (is_connected) closeConnection()
}

function getProductsByCat (req, res) {
  const id = req.swagger.params.id.value
  openConnection()
  const table = []
  Product.find({}).populate('category').then(products => {
    if (products == null) {
      res.status(200).json({
        message: 'List of products is empty'
      })
    } else {
      products?.map(item => {
        if (item.category._id.equals(id)) {
          table.push(item)
        }
        return table
      })
      res.status(200).json(table)
    }
  })
  if (is_connected) closeConnection()
}
function deleteProduct (req, res) {
  const id = req.swagger.params.id.value
  openConnection()

  Product.findById(id, (err, product) => {
    if (err) {
      res.status(300).json(err)
    } else if (product === null) {
      res.status(404).json({
        message: 'product not found'
      })
    } else {
      Product.deleteOne({ _id: id }).exec()
      res.status(200).json({
        message: 'product deleted'
      })
    }
  })

  if (is_connected) closeConnection()
}

module.exports = {
  getProducts,
  addProduct,
  setProduct,
  getProduct,
  deleteProduct,
  searchProducts,
  getProductsByCat,
  getProductsPagination

}
