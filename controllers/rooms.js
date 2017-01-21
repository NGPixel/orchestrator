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
  db.Room.orderBy('name').run()
  .then(rooms => {
    res.render('rooms/rooms', { rooms })
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`)
  })
})

module.exports = router
