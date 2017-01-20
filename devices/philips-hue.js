'use strict'

const Promise = require('bluebird')
const huejay = require('huejay')
const _ = require('lodash')

/**
 * Philips Hue devices module
 */
module.exports = {

  brand: 'Philips Hue', // REQUIRED

  /**
   * Scan for bridges on the network
   *
   * @return     {Promise<Object[], Error>}  List of found bridges
   */
  scanBridges () {
    let self = this

    return huejay.discover()
    .then(bridges => {
      return _.map(bridges, b => {
        return {
          ui: b.id,
          name: 'New Bridge (' + b.id + ')',
          brand: self.brand,
          model: 'Unknown',
          state: 'pending',
          ipAddress: b.ipAddress,
          macAddress: '',
          auth: '',
          meta: {},
          isSetup: false
        }
      })
    })
  },

  /**
   * Setup new bridge for use in Orchestrator
   *
   * @param      {Object}  bridge  The new bridge to setup
   * @return {Promise<Object>} The configured bridge
   */
  setupBridge (bridge) {
    // todo
  },

  /**
   * Scans all registered lights in bridges
   *
   * @param      {Object}  br  The bridge to scan
   * @return     {Promise<Array<Object>, Error>}  List of lights
   */
  scanLights (br) {
    let self = this

    let client = new huejay.Client({
      host: br.ipAddress,
      username: br.auth
    })

    return client.bridge.ping().then(() => {
      return client.bridge.isAuthenticated()
    }).then(() => {
      return client.lights.getAll().then(lights => {
        return _.map(lights, lt => {
          return {
            state: 'pending',
            colorMode: lt.colorMode,
            brightness: lt.brightness,
            hue: lt.hue,
            sat: lt.saturation,
            xy: lt.xy,
            ct: lt.colorTemp,
            alert: lt.alert,
            effect: lt.effect,
            uid: lt.id,
            name: lt.name,
            model: lt.modelId,
            meta: {
              swversion: lt.softwareVersion,
              type: lt.model.type,
              uniqueid: lt.uniqueId
            }
          }
        })
      })
    })
  }

}
