'use strict'

const express = require('express')
const router = express.Router()

// ==========================================
// API - Bridges
// ==========================================

/**
 * Discover
 */
router.post('/discover', (req, res, next) => {
  let huejay = require('huejay')

  huejay.discover()
  .then(bridges => {
    return res.json({ bridges }) || true
  })
  .catch(error => {
    res.status(500).json({ msg: error.message })
  })
})

module.exports = router
