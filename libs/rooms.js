'use strict'

const Promise = require('bluebird')
const _ = require('lodash')

/**
 * Devices module
 */
module.exports = {

  /**
   * Initialize the Devices class
   * @return     {Object}  Self
   */
  init () {
    let self = this

    return self
  },

  /**
   * Get all Rooms
   * @return {Promise<Array>} List of rooms
   */
  getAll () {
    return db.Room.orderBy('name').run()
  },

  /**
   * Create a new Room
   * @param {String} name Name of the Room
   * @return {Promise<Boolean>|Error} True on success, error otherwise
   */
  create (name) {
    let newRoom = new db.Room({
      name,
      class: 'expand' // TODO: Provide actual icons
    })
    return newRoom.saveAll().return(true)
  }
}
