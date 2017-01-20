'use strict'

const express = require('express')
const router = express.Router()

// ==========================================
// Dashboard
// ==========================================

/**
 * Dashboard
 */
router.get('/', (req, res, next) => {
  db.Light.getJoin().orderBy(db.r.row('device')('name')).run()
  .then(lights => {
    res.render('lights/lights', { lights })
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`)
  })
})

module.exports = router
