'use strict'

const express = require('express')
const router = express.Router()
const validator = require('validator')

// ==========================================
// API - Rooms
// ==========================================

/**
 * Create
 */
router.post('/create', (req, res, next) => {
  let roomName = req.body.name

  if (!validator.isLength(roomName, { min: 2, max: 255 })) {
    return res.status(400).json({ msg: 'Invalid room name' })
  }

  return orch.rooms.create(roomName).then((r) => {
    if (r === true) {
      return res.status(201).json({ msg: 'OK' })
    } else {
      return res.status(400).json({ msg: 'Invalid room name' })
    }
  })
})

/**
 * Assign Device to Room
 */
router.post('/assign-device', (req, res, next) => {
  let roomId = req.body.roomId
  let deviceId = req.body.deviceId

  if (!validator.isUUID(roomId)) {
    return res.status(400).json({ msg: 'Invalid room ID' })
  } else if (!validator.isUUID(deviceId)) {
    return res.status(400).json({ msg: 'Invalid device ID' })
  }

  return orch.rooms.assignDevice(roomId, deviceId).then((r) => {
    if (r === true) {
      return res.json({ msg: 'OK' })
    } else {
      return res.status(400).json({ msg: 'Invalid operation.' })
    }
  })
})

module.exports = router
