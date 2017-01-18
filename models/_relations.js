"use strict";

module.exports = (t) => {

	t.Bridge.hasMany(t.Device, "children", "id", "parentId");

	t.Device.belongsTo(t.Bridge, "parent", "parentId", "id");
	t.Device.belongsTo(t.Room, "room", "roomId", "id");

	t.Light.belongsTo(t.Device, "device", "deviceId", "id");

};