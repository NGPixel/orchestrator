"use strict";

var express = require('express');
var router = express.Router();
var _ = require('lodash');

// ==========================================
// Bridges
// ==========================================

/**
 * Overview
 */
router.get('/', (req, res, next) => {
	res.render('admin/bridges');
});

module.exports = router;