"use strict";

module.exports = (t) => {

	return t.createModel('device', {
		name: t.type.string().required(),
		brand: t.type.string().optional(),
		model: t.type.string().optional(),
		type: t.type.string().required(),
		address: t.type.string().optional(), 
		meta: t.type.object().optional().allowExtra(true),
		createdAt: t.type.date().default(t.r.now()),
		parentId: t.type.string(),
		roomId: t.type.string()
	});

};