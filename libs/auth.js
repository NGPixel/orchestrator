"use strict";

const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash');
const bcrypt = require('bcryptjs-then');

module.exports = function(passport) {

	// Serialization user methods

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		db.User.get(id).then((user) => {
			if(user) {
				done(null, user);
			} else {
				done(new Error('User not found.'), null);
			}
			return true;
		}).error((err) => {
			done(err, null);
		});
	});

	// Local Account

	passport.use('local',
		new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password'
		},
		(uEmail, uPassword, done) => {
			db.User.filter({ email: uEmail, provider: 'local' }).run().then((users) => {
				if(users && users.length === 1) {
					let user = _.head(users);
					return bcrypt.compare(uPassword, user.password).then((isValid) => {
						return (isValid) ? true : Promise.reject(new Error('Invalid Login'));
					}).then(() => {
						return done(null, user) || true;
					}).catch((err) => {
						 return done(err, null);
					});
				} else {
					return done(new Error('Invalid Login'), null);
				}
			}).error((err) => {
				done(err, null) ;
			});
		}
	));

	// Create users for first-time

	db.dbReady().then(() => {

		return db.User.count().execute().then((c) => {
			if(c < 1) {

				// Create root admin account

				winston.info('[AUTH] No administrator account found. Creating a new one...');
				bcrypt.hash('admin123').then((pwd) => {

					return (new db.User({
						provider: 'local',
						email: appconfig.admin,
						name: 'Administrator',
						password: pwd
					})).save();

				}).then(() => {
					winston.info('[AUTH] Administrator account created successfully!');
					return true;
				}).catch((err) => {
					winston.error('[AUTH] An error occured while creating administrator account:');
					winston.error(err);
				});
			}
		});

	});

};
