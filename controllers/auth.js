'use strict'

const express = require('express')
const router = express.Router()
const passport = require('passport')
const ExpressBrute = require('express-brute')
const ExpressBruteRethinkdbStore = require('brute-rethinkdb')
const moment = require('moment')

/**
 * Setup Express-Brute
 */
var EBstore = new ExpressBruteRethinkdbStore(db.r, {table: 'brute'})
var bruteforce = new ExpressBrute(EBstore, {
  freeRetries: 5,
  minWait: 60 * 1000,
  maxWait: 5 * 60 * 1000,
  refreshTimeoutOnRequest: false,
  failCallback (req, res, next, nextValidRequestDate) {
    req.flash('alert', {
      class: 'error',
      title: 'Too many attempts!',
      message: "You've made too many failed attempts in a short period of time, please try again " + moment(nextValidRequestDate).fromNow() + '.',
      iconClass: 'fa-times'
    })
    res.redirect('/login')
  }
})

/**
 * Login form
 */
router.get('/login', function (req, res, next) {
  res.render('auth/login', {
    usr: res.locals.usr
  })
})

router.post('/login', bruteforce.prevent, function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err) }

    if (!user) {
      req.flash('alert', {
        title: 'Invalid login',
        message: 'The email or password is invalid.'
      })
      return res.redirect('/login')
    }

    req.logIn(user, function (err) {
      if (err) { return next(err) }
      req.brute.reset(function () {
        return res.redirect('/')
      })
    })
  })(req, res, next)
})

/**
 * Logout
 */
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router
