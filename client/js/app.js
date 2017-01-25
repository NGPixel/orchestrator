'use strict'

/* global jQuery, Vue, axios */

jQuery(document).ready(function ($) {
  Vue.prototype.$http = axios

  // Global Notifications

  $(window).bind('beforeunload', () => {
    $('#notifload').addClass('active')
  })
  $(document).ajaxSend(() => {
    $('#notifload').addClass('active')
  }).ajaxComplete(() => {
    $('#notifload').removeClass('active')
  })
})

/* eslint-disable spaced-comment */
//=include components/alerts.js
/* eslint-enable spaced-comment */
