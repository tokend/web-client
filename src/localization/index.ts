import resources from '@/localization/resources'

import { createI18n } from 'vue-i18n'

const STORAGE_KEY = 'locale'
const DEFAULT_LOCALE = 'en'

const locale = localStorage?.getItem(STORAGE_KEY) ?? DEFAULT_LOCALE

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: locale,
  fallbackLocale: locale,
  ...resources,
})
