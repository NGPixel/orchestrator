"use strict";

module.exports = (t) => {

	let UserSchema = t.createModel('user', {
		email: t.type.string().required().email(),
		password: t.type.string().optional(),
		name: t.type.string().optional(),
		createdAt: t.type.date().default(t.r.now())
	});

	UserSchema.ensureIndex('email');

	return UserSchema;

};