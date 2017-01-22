'use script'

/* global jQuery, Vue */

jQuery(document).ready(function ($) {
  return new Vue({
    el: '#page-rooms',
    data: {
      createModal: {
        state: false,
        loading: false,
        name: '',
        nameIsError: false
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

        this.createModal.loading = true
        this.$http.post('/api/rooms/create', {
          name: self.createModal.name
        }).then((resp) => {
          window.location.reload(true)
        }).catch((err) => {
          console.error(err)
          // TODO
        })
      }
    }
  })
})
