'use strict'

const express = require('express')
const router = express.Router()

// ==========================================
// Rooms
// ==========================================

/**
 * Rooms
 */
router.get('/', (req, res, next) => {
  orch.rooms.getAll().then(rooms => {
    res.render('rooms/rooms', { rooms })
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`)
  })
})

module.exports = router
