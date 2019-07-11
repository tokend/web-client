import { getI18nNamespace, onI18nLanguageChange } from '@/i18n/index'
import { byAlpha2 } from 'iso-country-codes'

function getCountries () {
  const translations = getI18nNamespace('countries')

  return Object
    .keys(byAlpha2 || {})
    .map(code => ({ code, translation: translations[code] })) || []
}

let COUNTRIES = getCountries()

onI18nLanguageChange(_ => {
  COUNTRIES = getCountries()
})

export { COUNTRIES }
