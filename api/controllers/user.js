const { User } = require('../models/user')
const { openConnection, closeConnection, is_connected } = require('../helpers/database.js')

/**
*
* @param {Request} req
* @param {Response} res
*/

function searchUser (req, res) {
  const query = req.swagger.params.search.value
  openConnection()
  User.find({
    $or: [
      { name: { $regex: query, $options: '$i' } }, { nameAR: { $regex: query, $options: '$i' } }, { lastname: { $regex: query, $options: '$i' } }, { lastnameAR: { $regex: query, $options: '$i' } },
      { pseudo: { $regex: query, $options: '$i' } }, { pseudoAR: { $regex: query, $options: '$i' } }, { ville: { $regex: query, $options: '$i' } }, { villeAR: { $regex: query, $options: '$i' } },
      { pays: { $regex: query, $options: '$i' } }, { paysAR: { $regex: query, $options: '$i' } }
    ]
  }, (err, users) => {
    if (err) {
      res.status(300).json(err)
    } else {
      if (users.length === 0) {
        res.status(200).json({
          message: 'List of users is empty'
        })
      } else {
        res.status(200).json(users)
      }
    }
  })
  if (is_connected) closeConnection()
}

async function inscription (req, res) {
  openConnection()
  const email = req.body.email
  User.findOne({ $or: [{ email }] }, async (err, user) => {
    if (err != null) {
      res.status(300).json()
      closeConnection()
    } else if (user != null) {
      res.status(200).json({ message: 'votre compte  existe déja veuillez nous contactez' })
    } else {
      const user = new User()
      user.fullName = req.body.fullName
      user.email = req.body.email
      user.password = req.body.password
      user.date = req.body.date
      user.type = req.body.type
      user.sex = req.body.sex
      user.save().then(result => {
        res.status(200).json(result)
      }).catch(err => {
        res.status(300).json(err)
      })
      if (is_connected) closeConnection()
    }
  })
}

function editeuser (req, res) {
  const id = req.swagger.params.id.value
  openConnection()

  User.findById(id, (err, user) => {
    if (err != null || user == null) {
      res.status(300).json(err)
      closeConnection()
      return
    }
    user.fullName = req.body.fullName
    user.email = req.body.email
    user.date = req.body.date
    user.sex = req.body.sex

    user.save().then(result => {
      res.status(200).json(result)
    }).catch(err => {
      res.status(300).json(err)
    })
    if (is_connected) closeConnection()
  })
}

function deleteuser (req, res) {
  const id = req.swagger.params.id.value
  openConnection()

  User.findById(id, (err, user) => {
    if (err) {
      res.status(300).json(err)
    } else if (user === null) {
      res.status(404).json({
        message: 'user not found'
      })
    } else {
      User.deleteOne({ _id: id }).exec()
      res.status(200).json({
        message: 'user deleted'
      })
    }
  })

  if (is_connected) closeConnection()
}

function getusers (req, res) {
  openConnection()
  User.find({}, (err, user) => {
    if (err || user === null) {
      res.status(300).json()
    } else {
      res.status(200).json(user)
    }
  })
  if (is_connected) closeConnection()
}

function getuser (req, res) {
  const id = req.swagger.params.id.value
  openConnection()

  User.findById(id, (err, user) => {
    if (err || user === null) {
      res.status(300).json()
    } else {
      res.status(200).json(user)
    }
  })

  if (is_connected) closeConnection()
}
function getuserByType (req, res) {
  const id = req.swagger.params.type.value
  openConnection()

  User.find({ type: id }, (err, user) => {
    if (err || user === null) {
      res.status(300).json()
    } else {
      res.status(200).json(user)
    }
  })

  if (is_connected) closeConnection()
}

async function login (req, res) {
  openConnection()
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(300).send(e)
  }

  if (is_connected) closeConnection()
}

/**
*
*
*
* @param {Request} req
* @param {Response} res
*/

module.exports = {
  inscription,
  deleteuser,
  getusers,
  getuser,
  editeuser,
  login,
  getuserByType,
  searchUser

}
