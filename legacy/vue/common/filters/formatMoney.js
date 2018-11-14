import { polyglot } from 'L@/js/i18n'
import { DEFAULT_PRECISION } from 'L@/js/const/configs.const'

/*
 * accounting.js docs: http://openexchangerates.github.io/accounting.js/
 */
import accounting from 'accounting'

const NON_BREAKABLE_SPACE = '\xa0'

const DEFAULT_CRYPTO_CURRENCY_SETTINGS = Object.freeze({
  format: `%v${NON_BREAKABLE_SPACE}%s`,
  precision: DEFAULT_PRECISION
})

const SYMBOLS = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '₤'
}

const ACCOUNTING_SETTINGS = Object.freeze({
  en: Object.freeze({
    format: '%s%v',
    decimal: '.',
    thousand: ',',
    precision: 2
  })
})

function getSymbol (currency = '') {
  const currencyUppercased = currency.toUpperCase()
  return SYMBOLS[currencyUppercased] || currencyUppercased
}

function isCrypto (currency = '') {
  return getSymbol(currency).toUpperCase() === currency.toUpperCase()
}

function getFormatterSettings ({ currency, symbolAllowed }) {
  const locale = polyglot.locale()
  const settings = ACCOUNTING_SETTINGS[locale]

  if (symbolAllowed) {
    const symbol = getSymbol(currency)
    return isCrypto(currency)
      ? { ...settings, symbol, ...DEFAULT_CRYPTO_CURRENCY_SETTINGS }
      : { ...settings, symbol }
  } else {
    const symbol = currency
    return { ...settings, symbol, ...DEFAULT_CRYPTO_CURRENCY_SETTINGS }
  }
}

export function formatMoney (value, opts) {
  return accounting.formatMoney(value, getFormatterSettings(opts))
}
