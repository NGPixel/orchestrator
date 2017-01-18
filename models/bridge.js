"use strict";

module.exports = (t) => {

	return t.createModel('bridge', {
		name: t.type.string().required(),
		brand: t.type.string().optional(),
		model: t.type.string().optional(),
		ipAddress: t.type.string().required(),
		macAddress: t.type.string().optional(),
		auth: t.type.string().optional(),
		meta: t.type.object().optional().allowExtra(true),
		createdAt: t.type.date().default(t.r.now()),
	});

};