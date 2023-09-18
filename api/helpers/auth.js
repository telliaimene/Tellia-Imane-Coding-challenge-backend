const jwt = require('jsonwebtoken')
const { User } = require('../models/user')
function checkToken (req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, 'x-product-token-key')
    const user = User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (!user) {
      throw new Error()
    }
    req.token = token
    req.user = user
    next()
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' })
  }
}
module.exports = checkToken
