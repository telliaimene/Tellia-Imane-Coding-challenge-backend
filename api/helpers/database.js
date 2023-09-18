/**
 * Helper functions for database
 */

const mongoose = require('mongoose')

let is_connected = false

/**
 * Open connection for the database
 */
function openConnection () {
  if (!is_connected) {
    mongoose.connect('mongodb://localhost:27017/product', {
      useNewUrlParser: true,
      useUnifiedTopology: true

    })
  }
  mongoose.set('useCreateIndex', true)
  if (mongoose.connection) {
    is_connected = true
  }
}

/**
 * Close the connection if it exists
 */
function closeConnection () {
  mongoose.connection.close()
  is_connected = false
}

module.exports = {
  openConnection,
  closeConnection,
  is_connected
}
