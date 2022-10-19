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

    next()
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  }),
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
  body('is-admin').escape(),
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
        is_admin: req.body['is-admin'] === 'on' ? true : false,
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
  if (res.locals.currentUser) {
    res.render('access-form')
    return
  }

  res.redirect('log-in')
}

exports.givePermissionPost = [
  body('password', 'Enter correct password').custom(
    (value) => value === 'letmein'
  ),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('access-form', {
        errors: errors.array(),
      })
      return
    }

    const member = new User({
      first_name: res.locals.currentUser.first_name,
      last_name: res.locals.currentUser.last_name,
      user_name: res.locals.currentUser.user_name,
      password: res.locals.currentUser.password,
      is_member: true,
      _id: res.locals.currentUser._id,
    })

    User.findByIdAndUpdate(
      res.locals.currentUser._id,
      member,
      {},
      (err, themember) => {
        if (err) {
          return next(err)
        }

        res.redirect('/')
      }
    )
  },
]
