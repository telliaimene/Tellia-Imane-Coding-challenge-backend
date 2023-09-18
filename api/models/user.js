const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const userSchema = new mongoose.Schema({
  fullName: String,
  sex: {
    type: String,
    emu: ['Madam', 'Sir']
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate (value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"')
      }
    }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  date: Date,
  picture: String,
  // type admin or client
  type: {
    type: String,
    emu: ['client', 'admin', 'principal'],
    default: 'client'
  }

})
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject
}
userSchema.methods.generateAuthToken = async function () {
  const user = this
  process.env.JWT_SECRET = 'x-product-token-key'
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  // const tokenexpires =  Date.now() + 120000
  /// user.tokens = user.tokens.concat({ token ,tokenexpires  })
  // await user.save()
  return token
}
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Unable to login')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable to login')
  }
  return user
}
// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema)
module.exports = {
  User
}
