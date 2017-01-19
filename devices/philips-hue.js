'use strict'

// const Promise = require('bluebird')
const huejay = require('huejay')
const _ = require('lodash')

/**
 * Philips Hue devices module
 *
 * @return     {Object}  Philips Hue devices instance
 */
module.exports = {

  /**
   * Refresh devices
   *
   * @return     {Object}  DB instance
   */
  scanBridges () {
    return huejay.discover()
    .then(bridges => {
      return _.map(bridges, b => {
        return {
          ui: b.id,
          name: 'New Bridge (' + b.id + ')',
          brand: 'Philips Hue',
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
  }

}
