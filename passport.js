const bcrypt = require('bcryptjs')
const user = require('./models/user')
const LocalStrategy = require('passport-local').Strategy

const authenticateUser = (passport) => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      user.findOne({ user_name: username }, (err, user) => {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username' })
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, user)
          } else {
            // passwords do not match!
            return done(null, false, { message: 'Incorrect password' })
          }
        })
      })
    })
  )

  passport.serializeUser(function (user, done) {
    done(null, user._id)
  })

  passport.deserializeUser(function (_id, done) {
    user.findById(_id, function (err, user) {
      done(err, user)
    })
  })
}

module.exports = authenticateUser
