'use strict'

const express = require('express')
const router = express.Router()
const _ = require('lodash')
const validator = require('validator')

// ==========================================
// API - Devices
// ==========================================

/**
 * Get available Devices for a Room
 */
router.post('/get-available-for-room', (req, res, next) => {
  let roomId = req.body.roomId

  if (!validator.isUUID(roomId)) {
    return res.status(400).json({ msg: 'Invalid room ID' })
  }

  return db.Device.filter(db.r.row('roomId').ne(roomId), { default: true }).orderBy('name').pluck('id', 'name', 'brand', 'model', 'type').execute().then((d) => {
    if (_.isArray(d) && d.length > 0) {
      return res.json({ msg: 'OK', devices: d })
    } else {
      return res.status(400).json({ msg: 'No devices available for this room.' })
    }
  }).catch((err) => {
    res.status(500).json({ msg: 'An unexpected error occured while fetching available devices for this room.' })
    throw err
  })
})

module.exports = router
