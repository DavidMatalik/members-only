var express = require('express')
const message = require('../models/message')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  message
    .find({})
    .populate('user')
    .exec((err, listMessages) => {
      if (err) {
        return next(err)
      }

      res.render('index', { title: 'Express', listMessages })
    })
})

module.exports = router
