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

	db.Bridge.run()
  .then(bridges => {
  	res.render('bridges/bridges', { bridges });
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`);
  });

});

module.exports = router;