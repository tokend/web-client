import '@/styles/app.scss'
import 'virtual:svg-icons-register'

import App from '@/App.vue'
import log from 'loglevel'

import VueToastificationPlugin from 'vue-toastification'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { createApp, getCurrentInstance, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { initApi } from '@/api'
import { i18n } from '@/localization'
import { config } from '@config'
import { router } from '@/router'
import { store } from '@/store'

const app = createApp({
  setup() {
    const app = getCurrentInstance()
    const { t, locale } = useI18n({ useScope: 'global' })
    if (app) {
      app.appContext.config.globalProperties.$t = t
      app.appContext.config.globalProperties.$locale = locale
    }
    initApi()
  },
  render: () => h(App),
})

log.setDefaultLevel(config.LOG_LEVEL)

app.use(router).use(store).use(i18n).use(VueToastificationPlugin)

app.config.globalProperties.$routes = ROUTE_NAMES
app.config.globalProperties.$config = config
app.config.globalProperties.$icons = ICON_NAMES

app.config.errorHandler = function (err, vm, info) {
  log.error(`Error: ${err}; Info: ${info}`)
}

app.mount('#app')
