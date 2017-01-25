'use strict'

const express = require('express')
const router = express.Router()

// ==========================================
// Hubs
// ==========================================

/**
 * Overview
 */
router.get('/', (req, res, next) => {
  db.Hub.run()
  .then(hubs => {
    res.render('hubs/hubs', { hubs })
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`)
  })
})

module.exports = router
