'use strict'

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
  },

  /**
   * Assign a Room to a Device
   * @param {String} roomId Room ID
   * @param {String} deviceId Device ID
   * @return {Promise<Boolean>|Error} True on success, error otherwise
   */
  assignDevice (roomId, deviceId) {
    return db.Room.get(roomId).run().then(r => {
      if (r) {
        return db.Device.get(deviceId).run().then(d => {
          if (d) {
            d.room = r
            return d.saveAll().return(true)
          } else {
            return false
          }
        })
      } else {
        return false
      }
    })
  }
}
