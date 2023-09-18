'use strict'

const SwaggerExpress = require('swagger-express-mw')
const app = require('express')()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
app.use(cors())

const http = require('http')
module.exports = app // for testing
const config = {
  appRoot: __dirname

}

// UPLOAD IMAGE

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
    // cb(null,path.join(__dirname,'./uploads/'))
  },

  filename: function (req, file, cb) {
    // b cb(null, new Date().toISOString() + file.originalname)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage })
// UPLOAD JOURNAL
// const storageJournal = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, './journals/')
//   },

//   filename: function (req, file, cb) {
//       cb(null, new Date().toISOString() + file.originalname)
//   }
// })

// const upload = multer({ storageJournal: storageJournal })
// app.use(upload.single("image"))
app.use(upload.fields(
  [
    { name: 'journal', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'player', maxCount: 30 }
  ]
))
app.use('/uploads', express.static('uploads'))
SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err }
  // install middleware
  swaggerExpress.register(app)
  const port = process.env.PORT || 10010
  http.createServer(app).listen(port, function () {
    console.log('Server started @ %s!', port)
  })
  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log(
      `try this:\ncurl http://127.0.0.1:${port}/hello?name=Scott`
    )
  }
})
