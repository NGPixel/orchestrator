'use strict'

const Promise = require('bluebird')
const HarmonyHubDiscover = require('harmonyhubjs-discover')
const _ = require('lodash')

/**
 * Logitech Harmony devices module
 */
module.exports = {

  // Module info
  key: 'logitech-harmony',
  brand: 'Logitech Harmony',
  hub: {
    name: 'Logitech Harmony',
    icon: 'logitech-harmony.png'
  },

  /**
   * Scan for hubs on the network
   *
   * @return     {Promise<Object[], Error>}  List of found hubs
   */
  scanHubs () {
    return new Promise((resolve, reject) => {
      let discover = new HarmonyHubDiscover(61991)

      discover.on('online', function (hub) {
        console.log('discovered ' + hub.ip)
      })

      discover.start()
      _.delay(() => {
        discover.stop()
        resolve([])
      }, 5000)
    })
  }
}
