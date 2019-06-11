import './scss/app.scss'

import Vue from 'vue'
import App from '@/vue/App'
import i18next from 'i18next'
import Vuelidate from 'vuelidate'
import VueResource from 'vue-resource'
import log from 'loglevel'
import config from './config'
import IdleVue from 'idle-vue'
import NProgress from 'nprogress'

import { extendStoreWithScheme } from '@/vuex'
import { buildRouter } from '@/vue-router'
import { tableScrollShadow } from '@/vue/directives/tableScrollShadow'
import { ripple } from '@/vue/directives/ripple'
import { tooltip } from '@/vue/directives/tooltip'
import { i18nOptions, mergeIntoI18nOptions } from '@/i18n'
import { globalize } from '@/vue/filters/globalize'
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
import { SchemeRegistry } from '@/modules-arch/scheme-registry'
import { ErrorTracker } from '@/js/helpers/error-tracker'

async function init () {
  await SchemeRegistry.useScheme(config.MODULE_SCHEME_NAME)
  Vue.use(SchemeRegistry.current)

  if (SchemeRegistry.current.importEnLocaleFile) {
    const enLocaleJson = await SchemeRegistry.current.importEnLocaleFile()
    mergeIntoI18nOptions(enLocaleJson)
  }

  i18next.init(i18nOptions)

  log.setDefaultLevel(config.LOG_LEVEL)

  Vue.config.productionTip = false
  Vue.use(Vuelidate)
  Vue.use(VueResource)
  Vue.directive('table-scroll-shadow', tableScrollShadow)
  Vue.directive('ripple', ripple)
  Vue.directive('tooltip', tooltip)
  Vue.filter('globalize', globalize)
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

  const store = await extendStoreWithScheme(SchemeRegistry.current)
  const router = buildRouter(store)

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

  Vue.use(IdleVue, {
    eventEmitter: new Vue(),
    idleTime: config.IDLE_TIMEOUT,
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
