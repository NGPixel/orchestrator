'use strict'

const express = require('express')
const router = express.Router()

// ==========================================
// Bridges
// ==========================================

/**
 * Overview
 */
router.get('/', (req, res, next) => {
  db.Bridge.run()
  .then(bridges => {
    res.render('bridges/bridges', { bridges })
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`)
  })
})

module.exports = router
