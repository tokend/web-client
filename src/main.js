import './scss/app.scss'

import Vue from 'vue'
import App from '@/vue/App'
import i18next from 'i18next'
import Vuelidate from 'vuelidate'
import log from 'loglevel'
import config from './config'

import { store } from '@/vuex'
import { router } from '@/vue-router'
import { tableScrollShadow } from '@/vue/directives/tableScrollShadow'
import { ripple } from '@/vue/directives/ripple'
import { i18nOptions } from '@/i18n'
import { globalize } from '@/vue/filters/globalize'
import { formatDate } from '@/vue/filters/formatDate'
import { formatMoney } from '@/vue/filters/formatMoney'
import { formatNumber } from '@/vue/filters/formatNumber'
import { formatInteger } from '@/vue/filters/formatInteger'
import { formatPercent } from '@/vue/filters/formatPercent'
import { formatFeeType } from '@/vue/filters/formatFeeType'
import { formatCalendar } from '@/vue/filters/formatCalendar'
import { formatDateDMY } from '@/vue/filters/formatDateDMY'
import { formatOrderNumber } from '@/vue/filters/formatOrderNumber'
import { formatFeeSubType } from '@/vue/filters/formatFeeSubType'
import { abbreviate } from '@/vue/filters/abbreviate'

i18next.init(i18nOptions)

log.setDefaultLevel(config.LOG_LEVEL)

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.directive('table-scroll-shadow', tableScrollShadow)
Vue.directive('ripple', ripple)
Vue.filter('globalize', globalize)
Vue.filter('formatDate', formatDate)
Vue.filter('formatDateDMY', formatDateDMY)
Vue.filter('formatMoney', formatMoney)
Vue.filter('formatNumber', formatNumber)
Vue.filter('formatPercent', formatPercent)
Vue.filter('formatInteger', formatInteger)
Vue.filter('formatFeeType', formatFeeType)
Vue.filter('formatCalendar', formatCalendar)
Vue.filter('formatFeeSubType', formatFeeSubType)
Vue.filter('formatOrderNumber', formatOrderNumber)
Vue.filter('abbreviate', abbreviate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
