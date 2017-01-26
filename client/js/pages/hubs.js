'use strict'

/* global jQuery, Vue, Alerts, _ */

jQuery(document).ready(function ($) {
  return new Vue({
    el: '#page-hubs',
    data: {
      discoverModal: {
        module: false,
        moduleName: '',
        modules: [],
        hubs: [],
        state: false,
        step: 'fetching'
      },
      setupModal: {
        state: false,
        step: 'fetching'
      }
    },
    mounted: function () {
      let self = this
      $('#hubs-discovery-btn').on('click', (ev) => {
        self.discoverHubs(ev)
      })
    },
    methods: {
      /**
       * Discover New Hubs - Show Dialog
       * @param {Event} ev Event triggered by user
       * @return {undefined}
       */
      discoverHubs: function (ev) {
        let self = this
        this.discoverModal.module = false
        this.discoverModal.step = 'fetching'
        this.discoverModal.state = true

        self.$http.get('/api/hubs/get-supported').then((resp) => {
          self.discoverModal.modules = resp.data.modules
          self.discoverModal.step = 'select'
        }).catch((err) => {
          if (err.response.data.msg) {
            Alerts.pushError('Error', err.response.data.msg)
          } else {
            Alerts.pushError('Error', err.message)
          }
          self.discoverModal.state = false
        })
      },

      /**
       * Discover New Hubs - Hide Dialog
       * @param {Event} ev Event triggered by user
       * @return {undefined}
       */
      discoverHubsDiscard: function (ev) {
        this.discoverModal.state = false
      },

      /**
       * Dicover New Hubs - Select
       * @param {String} hubId Hub Definition Key
       * @return {undefined}
       */
      discoverHubsSelect: function (modKey) {
        this.discoverModal.module = modKey
        this.discoverModal.moduleName = _.find(this.discoverModal.modules, { 'key': modKey }).name
      },

      /**
       * Dicover New Hubs - Scan
       * @param {Event} ev Event triggered by user
       * @return {undefined}
       */
      discoverHubsScan: function (ev) {
        let self = this

        self.discoverModal.step = 'scanning'

        self.$http.post('/api/hubs/discover', {
          moduleKey: self.discoverModal.module
        }).then((resp) => {
          if (resp.data.ok === true) {
            self.discoverModal.hubs = resp.data.hubs
            self.discoverModal.step = 'found'
          } else {
            self.discoverModal.step = 'notfound'
          }
        }).catch((err) => {
          if (err.response.data.msg) {
            Alerts.pushError('Error', err.response.data.msg)
          } else {
            Alerts.pushError('Error', err.message)
          }
          self.discoverModal.step = 'notfound'
        })
      },

      /**
       * Discover New Hubs - Reload Page
       */
      discoverHubsFinish: function (ev) {
        let self = this

        self.discoverModal.step = 'redirect'
        window.location.reload(true)
      },

      /**
       * Setup Hub - Show Dialog
       * @param {String} hubId Hub ID
       * @return {undefined}
       */
      setupHub: function (hubId) {
        let self = this
        self.setupModal.step = 'fetching'
        self.setupModal.state = true

        _.delay(function () {
          self.setupModal.step = 'setup'
          self.$http.post('/api/hubs/setup', {
            hubId
          }).then((resp) => {
            self.setupModal.step = 'success'
          }).catch((err) => {
            if (err.response.data.msg) {
              Alerts.pushError('Error', err.response.data.msg)
            } else {
              Alerts.pushError('Error', err.message)
            }
            self.setupModal.state = false
          })
        }, 500)
      },

      /**
       * Setup Hub - Reload Page
       */
      setupHubFinish: function (ev) {
        let self = this

        self.setupModal.step = 'redirect'
        window.location.reload(true)
      }
    }
  })
})
