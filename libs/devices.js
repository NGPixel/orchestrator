'use strict'

const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

/**
 * Devices module
 */
module.exports = {

  moduleList: [],
  deviceDefaults: {},

  /**
   * Initialize the Devices class
   *
   * @return     {Object}  Self
   */
  init () {
    let self = this
    let devicesPath = path.resolve(ROOTPATH, 'devices')

    // Load devices

    fs
    .readdirSync(devicesPath)
    .filter(file => {
      return (file.indexOf('.') !== 0 && _.startsWith(file, '_') === false)
    })
    .forEach(file => {
      // let modName = _.upperFirst(_.camelCase(_.split(file, '.')[0]))
      self.moduleList.push(require(path.join(devicesPath, file)))
    })

    // Load device defaults

    self.deviceDefaults = require(path.join(devicesPath, '_defaults.js'))

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
        return mod.scanBridges().then(brs => {
          if (_.isArray(brs) && brs.length > 0) {
            return Promise.map(brs, br => {
              return db.Bridge.filter({ uid: br.uid, brand: br.brand }).count().run().then(c => {
                if (c < 1) {
                  let newBr = new db.Bridge(br)
                  return newBr.save(br)
                } else {
                  return Promise.resolve(true) // Bridge is already mapped
                }
              })
            })
          } else {
            return Promise.resolve(true) // Module didn't find any bridge
          }
        })
      } else {
        return Promise.resolve(true) // Module doesn't support bridges
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
            return Promise.map(bridges, br => {
              return mod.scanLights(br).then(lights => {
                if (_.isArray(lights) && lights.length > 0) {
                  return Promise.map(lights, lt => {
                    return db.Device.filter({ uid: lt.uid, brand: mod.brand }).count().execute().then(c => {
                      if (c < 1) {
                        //
                        // Create device
                        //
                        let newDv = new db.Device(
                          _.defaultsDeep(
                            _.pick(lt, ['name', 'model', 'uid', 'icon', 'meta']),
                            {
                              brand: mod.brand,
                              type: 'light'
                            }
                          )
                        )
                        newDv.parent = br

                        //
                        // Create light
                        //
                        let newLt = new db.Light(
                          _.defaultsDeep(
                            _.pick(lt, ['state', 'colorMode', 'brightness', 'hue', 'saturation', 'xy', 'colorTemp', 'alert', 'effect']),
                            self.deviceDefaults.light
                          )
                        )
                        newLt.device = newDv

                        return newLt.saveAll().return(true)
                      } else {
                        return Promise.resolve(true) // Light is already mapped
                      }
                    })
                  })
                } else {
                  return Promise.resolve(true) // No lights found by module
                }
              })
            })
          } else {
            return Promise.resolve(true) // Module doesn't have a bridge setup
          }
        })
      } else {
        return Promise.resolve(true) // Module doesn't support lights
      }
    })
  }

}
