import '@/styles/app.scss'

import App from '@/App.vue'
import log from 'loglevel'

import { createApp, getCurrentInstance, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { i18n } from '@/localization'
import { config } from '@config'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'

const app = createApp({
  setup () {
    const app = getCurrentInstance()
    const { t, locale } = useI18n({ useScope: 'global' })
    if (app) {
      app.appContext.config.globalProperties.$t = t
      app.appContext.config.globalProperties.$locale = locale
    }
  },
  render: () => h(App),
})

log.setDefaultLevel(config.LOG_LEVEL)

app.use(router).use(i18n)

app.config.globalProperties.$routes = ROUTE_NAMES
app.config.globalProperties.$config = config

app.mount('#app')
