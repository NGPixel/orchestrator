"use strict";

const thk = require('thinky'),
			fs   = require("fs"),
			path = require("path"),
			_ = require('lodash');

/**
 * MongoDB module
 *
 * @return     {Object}  MongoDB wrapper instance
 */
module.exports = {

	/**
	 * Initialize DB
	 *
	 * @return     {Object}  DB instance
	 */
	init() {

		let self = this;

		let dbModelsPath = path.resolve(ROOTPATH, 'models');

		// Init Thinky
		
		self = thk(appconfig.db);

		// Load DB Models

		fs
		.readdirSync(dbModelsPath)
		.filter(function(file) {
			return (file.indexOf(".") !== 0 && _.startsWith(file, '_') === false);
		})
		.forEach(function(file) {
			let modelName = _.upperFirst(_.camelCase(_.split(file,'.')[0]));
			self[modelName] = require(path.join(dbModelsPath, file))(self);
		});

		// Associate models

		require(path.join(dbModelsPath, '_relations.js'))(self);

		return self;

	}

};
