const Message = require('../models/message')
const { body, validationResult } = require('express-validator')

exports.createMessageGet = (req, res) => {
  if (res.locals.currentUser) {
    res.render('create-message')
    return
  }

  res.redirect('../users/log-in')
}

exports.createMessagePost = [
  body('message-title', 'Title must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('message-text', 'Text must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('sign-up-form', {
        errors: errors.array(),
      })
      return
    }

    const message = new Message({
      title: req.body['message-title'],
      text: req.body['message-text'],
      user: res.locals.currentUser,
    })

    message.save((err) => {
      if (err) {
        return next(err)
      }
      res.redirect('/')
    })
  },
]

exports.deleteMessageGet = (req, res) => {
  Message.findById(req.params.id).exec((err, message) => {
    if (err) {
      return next(err)
    }
    if (message == null) {
      res.redirect('/')
    }
    res.render('delete-message', { message })
  })
}

exports.deleteMessagePost = (req, res) => {
  if (res.locals.currentUser?.is_admin) {
    Message.findByIdAndRemove(req.body.messageid, (err) => {
      if (err) {
        return next(err)
      }
      res.redirect('../../../')
    })
    return
  }
  res.redirect('../../../')
}
