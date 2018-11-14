import numberFormatter from 'accounting'
import { DEFAULT_PRECISION, DEFAULT_CONVERSION_PRESICION } from '../const/configs.const'

const locales = {
  en: {
    currency: {
      symbol: '', // default currency symbol is '$'
      format: '%s%v', // controls output: %s = symbol, %v = value/number (can be object: see below)
      decimal: '.', // decimal point separator
      thousand: ',', // thousands separator
      precision: DEFAULT_PRECISION // decimal places
    },
    number: {
      precision: 0,
      thousand: ',',
      decimal: '.'
    },
    symbol: '$'
  }
}

export function formatCurrency (locale = 'en') {
  numberFormatter.settings = locales[locale]
  return (n) => {
    return numberFormatter.formatMoney(n).replace(/^0+(\d)|(\d)0+$/gm, '$1$2')
  }
}

export function formatConvertedCurrency (locale = 'en') {
  const settings = locales[locale].currency
  return (n) => {
    return numberFormatter.formatMoney(n, {
      ...settings,
      symbol: locales[locale].symbol,
      precision: DEFAULT_CONVERSION_PRESICION
    })
  }
}

export function formatNumber (locale = 'en') {
  numberFormatter.settings = locales[locale]
  return (n) => {
    return numberFormatter.formatNumber(n)
  }
}
