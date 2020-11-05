import { byAlpha2 } from 'iso-country-codes'

let COUNTRIES = Object.keys(byAlpha2 || {})

export { COUNTRIES }
