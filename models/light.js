'use strict'

module.exports = (t) => {
  return t.createModel('light', {
    state: t.type.string().required(),
    colorMode: t.type.string().required(),
    brightness: t.type.number().optional().integer(),
    hue: t.type.number().optional().integer().min(0).max(65535),
    sat: t.type.number().optional().integer().min(0).max(255),
    xy: t.type.point().optional(),
    ct: t.type.number().optional().integer().min(0),
    alert: t.type.string().optional(),
    effect: t.type.string().optional(),
    deviceId: t.type.string()
  })
}
