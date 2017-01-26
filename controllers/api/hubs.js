'use strict'

const express = require('express')
const router = express.Router()
const _ = require('lodash')

// ==========================================
// API - Hubs
// ==========================================

/**
 * Get all supported hub definitions
 */
router.get('/get-supported', (req, res, next) => {
  let hdefs = orch.devices.getHubDefinitions()

  if (_.isArray(hdefs)) {
    res.json({ modules: hdefs })
  } else {
    res.status(500).json({ msg: 'No hub definitions available.' })
  }
})

/**
 * Discover
 */
router.post('/discover', (req, res, next) => {
  let moduleKey = req.body.moduleKey

  orch.devices.scanHubs(moduleKey).then((hubs) => {
    res.json({ ok: (hubs.length > 0), hubs })
  }).catch((err) => {
    res.status(500).json({ msg: err.message })
  })
})

/**
 * Setup Hub
 */
router.post('/setup', (req, res, next) => {
  let hubId = req.body.hubId

  orch.devices.setupHub(hubId).then((ok) => {
    res.json({ ok })
  }).catch((err) => {
    res.status(500).json({ msg: err.message })
  })
})

module.exports = router
