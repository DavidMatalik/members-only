const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')

exports.loginUserGet = (req, res) => {
  res.render('log-in')
}

exports.loginUserPost = [
  body('username', 'Enter a username').trim().isLength({ min: 1 }).escape(),
  body('password', 'Enter a password').isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('log-in', {
        errors: errors.array(),
      })
      return
    }

    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/',
    })
  },
]

exports.createUserGet = (req, res, next) => {
  res.render('sign-up-form')
}

exports.createUserPost = [
  body('firstname', 'First name must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastname', 'Last name must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('username', 'User name must be specified and in email format')
    .trim()
    .isEmail()
    .escape(),
  body('password', 'Password must be at least 5 characters long')
    .isLength({ min: 5 })
    .escape(),
  body('password-repeat', 'Repeat your password with the same value').custom(
    (value, { req }) => value === req.body.password
  ),

  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err)
      }
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.render('sign-up-form', {
          errors: errors.array(),
        })
        return
      }
      const user = new User({
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        user_name: req.body.username,
        password: hashedPassword,
      })
      user.save((err) => {
        if (err) {
          return next(err)
        }
        res.redirect('/')
      })
    })
  },
]

exports.givePermissionGet = (req, res, next) => {
  res.render('access-form')
}

exports.givePermissionPost = [
  body('password', 'Enter correct password').custom(
    (value) => value === 'letmein'
  ),

  (req, res, next) => {
    // Find user in DB by user_id
    // Create user object with member: true
    // Update that user object in Database
  },
]
