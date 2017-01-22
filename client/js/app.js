'use script'

/* global jQuery, Vue, axios */

jQuery(document).ready(function ($) {
  Vue.prototype.$http = axios
})
