'use strict'

const huejay = require('huejay')
const _ = require('lodash')

/**
 * Philips Hue devices module
 */
module.exports = {

  // Module info
  key: 'philips-hue',
  brand: 'Philips Hue',
  hub: {
    name: 'Philips Hue',
    icon: 'philips-hue.png'
  },

  // List of models and their matching icons
  _modelIcons: [
    {
      id: ['LCT001', 'LCT007', 'LCT010', 'LCT014'],
      icon: 'philips-hue/white_e27_b22.svg'
    },
    {
      id: ['LLM001', 'LWB004', 'LWB006', 'LWB007', 'LWB010', 'LWB014', 'LLM010', 'LLM011', 'LLM012', 'LTW001', 'LTW004'],
      icon: 'philips-hue/white_and_color_e27_b22.svg'
    },
    {
      id: ['LST001', 'LST002'],
      icon: 'philips-hue/lightstrip.svg'
    },
    {
      id: ['LCT003', 'LTW013', 'LTW014'],
      icon: 'philips-hue/gu10.svg'
    },
    {
      id: ['LCT002', 'LCT011'],
      icon: 'philips-hue/br30.svg'
    },
    {
      id: [], // todo: Find model ID for PAR16 lightbulb
      icon: 'philips-hue/par16.svg'
    },
    {
      id: ['LLC020'],
      icon: 'philips-hue/go.svg'
    },
    {
      id: ['LLC006', 'LLC010'],
      icon: 'philips-hue/iris.svg'
    },
    {
      id: ['LLC011', 'LLC012'],
      icon: 'philips-hue/bloom.svg'
    },
    {
      id: ['LLC007'],
      icon: 'philips-hue/aura.svg'
    },
    {
      id: ['LLC013'],
      icon: 'philips-hue/storylight.svg'
    }
  ],

  /**
   * Scan for bridges on the network
   *
   * @return     {Promise<Object[], Error>}  List of found bridges
   */
  scanHubs () {
    let self = this

    return huejay.discover()
    .then(bridges => {
      return _.map(bridges, b => {
        return {
          uid: b.id,
          moduleKey: self.key,
          name: 'New Bridge (' + b.id + ')',
          brand: self.brand,
          model: 'Unknown',
          state: 'pending',
          icon: 'unknown.svg',
          ipAddress: b.ip,
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
  setupHub (bridge) {
    let client = new huejay.Client({
      host: bridge.ipAddress
    })
    let clientUser = new client.users.User()
    clientUser.deviceType = 'orchestrator#app'

    return new Promise((resolve, reject) => {
      let setupCheckIdx = 0
      let setupCheckIsPending = false
      let setupCheck = setInterval(() => {
        setupCheckIdx++
        if (!setupCheckIsPending) {
          setupCheckIsPending = true
          client.users.create(clientUser).then(usr => {
            clearInterval(setupCheck)
            bridge.auth = usr.username
            return client.bridge.get().then(br => {
              bridge.name = br.name
              bridge.model = br.modelId
              bridge.state = 'online'
              bridge.macAddress = br.macAddress
              bridge.isSetup = true
              bridge.icon = (br.modelId === 'BSB001') ? 'philips-hue/bridge_v1.svg' : 'philips-hue/bridge_v2.svg'
              bridge.meta = _.pick(br, ['softwareVersion', 'apiVersion', 'zigbeeChannel', 'timeZone', 'id'])
              bridge.save().then(() => {
                return resolve(br)
              })
            }).catch((err) => {
              reject(err)
            })
          }).catch(error => {
            if (error instanceof huejay.Error && error.type === 101) {
              setupCheckIsPending = false
              return true // Button not pressed yet.
            } else {
              clearInterval(setupCheck)
              reject(new Error(error.message))
            }
          })
        }
        if (setupCheckIdx > 30) {
          clearInterval(setupCheck)
          reject(new Error('Button was not pressed within time limit.'))
        }
      }, 1000)
    })
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
            icon: self._getModelIcon(lt.modelId),
            meta: {
              swversion: lt.softwareVersion,
              type: lt.model.type,
              uniqueid: lt.uniqueId
            }
          }
        })
      })
    })
  },

  /**
   * Gets the model icon path from the model ID.
   *
   * @param      {String}  md      Model ID
   * @return     {String}   The model icon path.
   */
  _getModelIcon (md) {
    let self = this

    let matchedMI = _.find(self._modelIcons, mi => {
      return _.includes(mi.id, md)
    })

    return (matchedMI) ? matchedMI.icon : ''
  }

}
