'use strict'

const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

/**
 * Devices module
 */
module.exports = {

  moduleList: {},

  /**
   * Initialize the Devices class
   *
   * @return     {Object}  Self
   */
  init () {
    let self = this
    let devicesPath = path.resolve(ROOTPATH, 'devices')

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
   * Scans bridges across all modules
   *
   * @return {Promise<Boolean, Error>} Promise of the operation
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
                  return newBr.save(br)
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
   * Refresh light devices from all bridges
   *
   * @return     {Promise<Boolean, Error>}  Promise of the operation
   */
  scanLights () {
    let self = this

    return Promise.map(self.moduleList, mod => {
      if (_.has(mod, 'scanLights')) {
        return db.Bridge.filter({ brand: mod.brand }).run().then(bridges => {
          if (_.isArray(bridges) && bridges.length > 0) {
            mod.scanLights(bridges).then(lights => {
              if (_.isArray(lights) && lights.length > 0) {
                return Promise.map(lights, lt => {
                  return db.Device.filter({ uid: lt.uid, brand: lt.brand }).count().run().then(c => {
                    if (c < 1) {
                      // todo
                      let newLt = new db.Light(lt)
                      return newLt.save(lt)
                    } else {
                      return Promise.resolve(true)
                    }
                  })
                })
              }
            })
          } else {
            return Promise.resolve(true)
          }
        })
      } else {
        return Promise.resolve(true)
      }
    })
  }

}
