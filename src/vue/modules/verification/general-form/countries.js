import countries from '@/i18n/en.countries'

function getCountryCodes () {
  return Object
    .entries(countries)
    .map(([code, translation]) => ({ code, translation }))
}

export const COUNTRIES = getCountryCodes()
