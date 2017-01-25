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
      self.moduleList.push(require(path.join(devicesPath, file)))
    })

    // Load device defaults

    self.deviceDefaults = require(path.join(devicesPath, '_defaults.js'))

    return self
  },

  /**
   * Get all supported hub definitions
   * @return {Array<Object>} List of hub definitions
   */
  getHubDefinitions () {
    let self = this
    return _.map(_.filter(self.moduleList, m => {
      return _.has(m, 'hub')
    }), m => {
      return {
        key: m.key,
        name: m.hub.name,
        icon: m.hub.icon
      }
    })
  },

  /**
   * Scans hubs across all modules
   *
   * @param {String} modKey Key of the module to scan from
   * @return {Promise<Boolean, Error>} Promise of the operation
   */
  scanHubs (modKey) {
    let self = this

    let mod = _.find(self.moduleList, { key: modKey })
    if (_.has(mod, 'scanHubs')) {
      return mod.scanHubs().then(hubs => {
        if (_.isArray(hubs) && hubs.length > 0) {
          return Promise.map(hubs, hb => {
            return db.Hub.filter({ uid: hb.uid, brand: hb.brand }).count().execute().then(c => {
              if (c < 1) {
                let newHub = new db.Hub(hb)
                return newHub.save().return(_.pick(hb, ['uid', 'name', 'ipAddress']))
              } else {
                return Promise.resolve(true) // Bridge is already mapped
              }
            })
          })
        } else {
          return Promise.resolve(true) // Module didn't find any bridge
        }
      }).then((results) => {
        return _.filter(results, (r) => {
          return _.isPlainObject(r) && _.has(r, 'uid')
        })
      })
    } else {
      return Promise.resolve(true) // Module doesn't support hubs
    }
  },

  /**
   * Refresh light devices from all hubs
   *
   * @return     {Promise<Boolean, Error>}  Promise of the operation
   */
  scanLights () {
    let self = this

    return Promise.map(self.moduleList, mod => {
      if (_.has(mod, 'scanLights')) {
        return db.Hub.filter({ brand: mod.brand }).run().then(hubs => {
          if (_.isArray(hubs) && hubs.length > 0) {
            return Promise.map(hubs, hb => {
              return mod.scanLights(hb).then(lights => {
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
                        newDv.parent = hb

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
            return Promise.resolve(true) // Module doesn't have a hub setup
          }
        })
      } else {
        return Promise.resolve(true) // Module doesn't support lights
      }
    })
  }

}
