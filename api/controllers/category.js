const { Category } = require('../models/category')
const { openConnection, closeConnection, is_connected } = require('../helpers/database.js')

function searchCategory (req, res) {
  const query = req.swagger.params.search.value
  openConnection()
  Category.find({ entitled: new RegExp(query, 'i') }).then(categories => {
    if (categories.length === 0) {
      res.status(404).json({
        message: 'List of categories is empty'
      })
    } else {
      res.status(200).json(categories)
    }
  })
  if (is_connected) closeConnection()
}

function getCategories (req, res) {
  openConnection()

  Category.find({}, (err, categories) => {
    if (err) {
      res.status(300).json(err)
    } else if (categories.length === 0) {
      res.status(404).json({
        message: 'List of categories is empty'
      })
    } else {
      res.status(200).json(categories)
    }
  })

  if (is_connected) closeConnection()
}

function addCategory (req, res) {
  openConnection()
  const category = new Category()
  category.entitled = req.body.entitled
  category.actions.push({
    user: req.body.action.user,
    action: 'Add',
    date: req.body.action.date
  })
  category.save().then(result => {
    res.status(200).json(result)
  }).catch(err => {
    res.status(300).json(err)
  })

  if (is_connected) closeConnection()
}

function setCategory (req, res) {
  const id = req.swagger.params.id.value
  openConnection()

  Category.findById(id, (err, category) => {
    if (err) {
      res.status(300).json(err)
    } else if (category === null) {
      res.status(404).json({
        message: 'Category not found'
      })
    } else {
      category.entitled = req.body.entitled
      category.actions.push({
        user: req.body.action.user,
        action: 'Update',
        date: req.body.action.date
      })
      category.save().then(result => {
        res.status(200).json(result)
      }).catch(err => {
        res.status(300).json(err)
      })
    }
  })

  if (is_connected) closeConnection()
}

function deleteCategory (req, res) {
  const id = req.swagger.params.id.value
  openConnection()

  Category.findById(id, (err, category) => {
    if (err) {
      res.status(300).json(err)
    } else if (category === null) {
      res.status(404).json({
        message: 'Category not found'
      })
    } else {
      Category.deleteOne({ _id: id }).exec()
      res.status(200).json({
        message: 'Catagory deleted'
      })
    }
  })

  if (is_connected) closeConnection()
}

module.exports = {
  getCategories,
  addCategory,
  setCategory,
  deleteCategory,
  searchCategory
}
