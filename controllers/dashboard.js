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
  res.render('dashboard/dashboard')
})

module.exports = router
