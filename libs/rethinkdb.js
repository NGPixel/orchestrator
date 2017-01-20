'use strict'

const thk = require('thinky')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

/**
 * RethinkDB module
 *
 * @return     {Object}  MongoDB wrapper instance
 */
module.exports = {

  /**
   * Initialize DB
   *
   * @return     {Object}  DB instance
   */
  init () {
    let self = this
    let dbModelsPath = path.resolve(ROOTPATH, 'models')

    // Init Thinky

    self = thk(appconfig.db)

    // Load DB Models

    fs
    .readdirSync(dbModelsPath)
    .filter(file => {
      return (file.indexOf('.') !== 0 && _.startsWith(file, '_') === false)
    })
    .forEach(file => {
      let modelName = _.upperFirst(_.camelCase(_.split(file, '.')[0]))
      self[modelName] = require(path.join(dbModelsPath, file))(self)
    })

    // Associate models

    require(path.join(dbModelsPath, '_relations.js'))(self)

    // Build indexes

    require(path.join(dbModelsPath, '_indexes.js'))(self)

    return self
  }

}
