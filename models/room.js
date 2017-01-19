'use strict'

module.exports = (t) => {
  return t.createModel('room', {
    name: t.type.string().required(),
    class: t.type.string().required()
  })
}
