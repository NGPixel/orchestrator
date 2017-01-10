"use strict";

var express = require('express');
var router = express.Router();
var _ = require('lodash');

// ==========================================
// Dashboard
// ==========================================

/**
 * Dashboard
 */
router.get('/', (req, res, next) => {
	res.render('dashboard/dashboard');
});

module.exports = router;