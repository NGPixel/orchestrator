'use strict'

module.exports = (t) => {
  return t.createModel('device', {
    name: t.type.string().required(),
    brand: t.type.string().optional(),
    model: t.type.string().optional(),
    type: t.type.string().required(),
    uid: t.type.string().required(),
    meta: t.type.object().optional().allowExtra(true),
    createdAt: t.type.date().default(t.r.now()),
    parentId: t.type.string(),
    roomId: t.type.string()
  })
}
