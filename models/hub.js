'use strict'

module.exports = (t) => {
  return t.createModel('hub', {
    uid: t.type.string().required(),
    name: t.type.string().required(),
    brand: t.type.string().required(),
    model: t.type.string().optional(),
    icon: t.type.string().optional(),
    state: t.type.string().required(),
    ipAddress: t.type.string().required(),
    macAddress: t.type.string().optional(),
    auth: t.type.string().optional(),
    meta: t.type.object().optional().allowExtra(true),
    isSetup: t.type.boolean().required().default(false),
    createdAt: t.type.date().required().default(t.r.now())
  })
}
