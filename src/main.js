import './scss/app.scss'

import Vue from 'vue'
import App from '@/vue/App'
import Vuelidate from 'vuelidate'
import VueResource from 'vue-resource'
import VueHead from 'vue-head'
import log from 'loglevel'
import config from './config'
import NProgress from 'nprogress'
import moment from 'moment'
import router from '@/vue-router'

import { buildStore } from '@/vuex'
import { tableScrollShadow } from '@/vue/directives/tableScrollShadow'
import { ripple } from '@/vue/directives/ripple'
import { i18n } from '@/i18n'
import { globalize } from '@/vue/filters/globalize'
import { globalizeCountry } from './vue/filters/globalizeCountry'
import { formatDate } from '@/vue/filters/formatDate'
import { formatMoney } from '@/vue/filters/formatMoney'
import { formatNumber } from '@/vue/filters/formatNumber'
import { formatInteger } from '@/vue/filters/formatInteger'
import { formatPercent } from '@/vue/filters/formatPercent'
import { formatCalendar } from '@/vue/filters/formatCalendar'
import { formatCalendarInline } from '@/vue/filters/formatCalendarInline'
import { formatDateDMY } from '@/vue/filters/formatDateDMY'
import { formatDateDMYT } from '@/vue/filters/formatDateDMYT'
import { abbreviate } from '@/vue/filters/abbreviate'
import { cropAddress } from '@/vue/filters/cropAddress'
import { ErrorTracker } from '@/js/helpers/error-tracker'
import { vueRoutes } from './vue-router/routes'
import { useBrowserUpdateBanner } from './browser-update'
import { keyValues } from '@/key-values'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { initApi } from './api'

async function init () {
  useBrowserUpdateBanner(Vue)

  await initApi()
  await keyValues.load()

  i18n.onLanguageChanged(lang => moment.locale(lang))
  await i18n.init()

  log.setDefaultLevel(config.LOG_LEVEL)

  Vue.config.devtools = process.env.NODE_ENV === 'development'
  Vue.config.productionTip = false
  Vue.use(Vuelidate)
  Vue.use(VueResource)
  Vue.use(VueHead)
  Vue.directive('table-scroll-shadow', tableScrollShadow)
  Vue.directive('ripple', ripple)
  Vue.filter('globalize', globalize)
  Vue.filter('globalizeCountry', globalizeCountry)
  Vue.filter('formatDate', formatDate)
  Vue.filter('formatDateDMY', formatDateDMY)
  Vue.filter('formatDateDMYT', formatDateDMYT)
  Vue.filter('formatMoney', formatMoney)
  Vue.filter('formatNumber', formatNumber)
  Vue.filter('formatPercent', formatPercent)
  Vue.filter('formatInteger', formatInteger)
  Vue.filter('formatCalendar', formatCalendar)
  Vue.filter('formatCalendarInline', formatCalendarInline)
  Vue.filter('abbreviate', abbreviate)
  Vue.filter('cropAddress', cropAddress)
  Vue.prototype.$config = config
  Vue.prototype.$routes = vueRoutes
  Vue.prototype.$kv = keyValues
  Vue.prototype.$DOCUMENT_TYPES = DOCUMENT_TYPES

  const store = buildStore()

  router.beforeEach((to, from, next) => {
    if (to.name !== from.name) {
      NProgress.start()
    }
    next()
  })

  NProgress.configure({ showSpinner: false })
  router.afterEach((to, from) => {
    NProgress.done()
  })

  ErrorTracker.init(config)

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>',
  })
}

init()
