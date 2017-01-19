'use strict'

const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

/**
 * Devices module
 *
 * @return     {Object}  Devices instance
 */
module.exports = {

  moduleList: {},

  init () {
    let self = this
    let devicesPath = path.resolve(ROOTPATH, 'devices')

    // Load device modules

    fs
    .readdirSync(devicesPath)
    .filter(file => {
      return (file.indexOf('.') !== 0)
    })
    .forEach(file => {
      let modName = _.upperFirst(_.camelCase(_.split(file, '.')[0]))
      self.moduleList[modName] = require(path.join(devicesPath, file))
    })

    return self
  },

  /**
   * Refresh devices
   *
   * @return     {Object}  DB instance
   */
  scanLights () {
    let self = this

    return Promise.map(self.moduleList, mod => {
      if (_.has(mod, 'scanBridges')) {
        mod.scanBridges().then(brs => {
          if (_.isArray(brs) && brs.length > 0) {
            return Promise.map(brs, br => {
              return db.Bridge.filter({ uid: br.uid, brand: br.brand }).count().run().then(c => {
                if (c < 1) {
                  let newBr = new db.Bridge(br)
                  return newBr.insert(br)
                } else {
                  return Promise.resolve(true)
                }
              })
            })
          }
        })
      }
    })
  },

  /**
   * Scans bridges.
   */
  scanBridges () {
    let self = this

    return Promise.map(self.moduleList, mod => {
      if (_.has(mod, 'scanBridges')) {
        mod.scanBridges().then(brs => {
          if (_.isArray(brs) && brs.length > 0) {
            return Promise.map(brs, br => {
              return db.Bridge.filter({ uid: br.uid, brand: br.brand }).count().run().then(c => {
                if (c < 1) {
                  let newBr = new db.Bridge(br)
                  return newBr.insert(br)
                } else {
                  return Promise.resolve(true)
                }
              })
            })
          }
        })
      }
    })
  }

}
