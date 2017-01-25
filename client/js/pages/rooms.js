'use strict'

/* global jQuery, Vue, Alerts */

jQuery(document).ready(function ($) {
  return new Vue({
    el: '#page-rooms',
    data: {
      createModal: {
        state: false,
        loading: false,
        name: '',
        nameIsError: false
      },
      assignModal: {
        state: false,
        loading: false,
        loadingMsg: 'fetching',
        device: '',
        devices: [],
        roomId: '',
        roomName: '',
        deviceIsError: false
      }
    },
    mounted: function () {
      let self = this
      $('#rooms-create-btn').on('click', (ev) => {
        self.createRoom(ev)
      })
    },
    methods: {
      /**
       * Create New Room - Show Dialog
       * @param {Event} ev Event triggered by user
       * @return {undefined}
       */
      createRoom: function (ev) {
        this.createModal.name = ''
        this.createModal.nameIsError = false
        this.createModal.state = true
      },

      /**
       * Create New Room - Hide Dialog
       * @param {Event} ev Event triggered by user
       * @return {undefined}
       */
      createRoomDiscard: function (ev) {
        this.createModal.state = false
      },

      /**
       * Create New Room - Create
       * @param {Event} ev Event triggered by user
       * @return {undefined}
       */
      createRoomCreate: function (ev) {
        let self = this

        if (self.createModal.name.length < 2) {
          self.createModal.nameIsError = true
          return
        }

        self.createModal.loading = true
        self.$http.post('/api/rooms/create', {
          name: self.createModal.name
        }).then((resp) => {
          window.location.reload(true)
        }).catch((err) => {
          if (err.response.data.msg) {
            Alerts.pushError('Error', err.response.data.msg)
          } else {
            Alerts.pushError('Error', err.message)
          }
          self.createModal.loading = false
        })
      },

      /**
       * Assign Room to Device - Show Dialog
       * @param {Event} ev Event triggered by user
       * @return {undefined}
       */
      assignRoom: function (roomId, roomName) {
        let self = this

        self.assignModal.device = ''
        self.assignModal.deviceIsError = false
        self.assignModal.loading = true
        self.assignModal.loadingMsg = 'fetching'
        self.assignModal.roomId = roomId
        self.assignModal.roomName = roomName
        self.assignModal.state = true

        self.$http.post('/api/devices/get-available-for-room', {
          roomId: roomId
        }).then((resp) => {
          self.assignModal.devices = resp.data.devices
          self.assignModal.device = resp.data.devices[0].id
          self.assignModal.loading = false
        }).catch((err) => {
          if (err.response.data.msg) {
            Alerts.pushError('Error', err.response.data.msg)
          } else {
            Alerts.pushError('Error', err.message)
          }
          self.assignModal.state = false
        })
      },

      /**
       * Assign Room to Device - Hide Dialog
       * @param {Event} ev Event triggered by user
       * @return {undefined}
       */
      assignRoomDiscard: function (ev) {
        this.assignModal.state = false
      },

      /**
       * Assign Room to Device - Assign
       * @param {Event} ev Event triggered by user
       * @return {undefined}
       */
      assignRoomAssign: function (ev) {
        let self = this

        if (self.assignModal.device.length < 2) {
          self.assignModal.deviceIsError = true
          return
        }

        self.assignModal.loadingMsg = 'assigning'
        self.assignModal.loading = true
        self.$http.post('/api/rooms/assign-device', {
          roomId: self.assignModal.roomId,
          deviceId: self.assignModal.device
        }).then((resp) => {
          window.location.reload(true)
        }).catch((err) => {
          if (err.response.data.msg) {
            Alerts.pushError('Error', err.response.data.msg)
          } else {
            Alerts.pushError('Error', err.message)
          }
          self.assignModal.loading = false
        })
      }
    }
  })
})
