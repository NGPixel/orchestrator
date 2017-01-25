'use strict'

module.exports = (t) => {
  t.Hub.hasMany(t.Device, 'devices', 'id', 'hubId')

  t.Device.belongsTo(t.Hub, 'hub', 'hubId', 'id')
  t.Device.belongsTo(t.Room, 'room', 'roomId', 'id')

  t.Light.belongsTo(t.Device, 'device', 'deviceId', 'id')

  t.Room.hasMany(t.Device, 'devices', 'id', 'roomId')
}
