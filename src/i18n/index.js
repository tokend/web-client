import moment from 'moment'
import numeral from 'numeral'

import _isObject from 'lodash/isObject'
import _merge from 'lodash/merge'

function buildI18n (language, ...localesJson) {
  let result
  switch (language) {
    case 'en':
      result = _merge(
        require(`./en`),
        require(`./en.terms`),
        require(`./en.pre-issuance-guide`),
        ...localesJson
      )
      break
    default:
      throw new Error('Locale not found')
  }

  return result
}

function buildI18nOptions (language, i18n) {
  return {
    lng: language,
    debug: false,
    resources: {
      en: {
        translation: {
          ...i18n.translations,
        },
      },
    },
    whitelist: ['en'],
    // set to true if you need en-US/en-UK lng's:
    nonExplicitWhitelist: false,
    interpolation: {
      format: (param, format) => {
        switch (format.toLowerCase()) {
          case 'date':
            return moment(param).format(i18n.config.date.presets.datetime)
          case 'dmy':
            return moment(param).format(i18n.config.date.presets.dmy)
          case 'calendar':
            return moment(param).calendar(null, {
              sameDay: i18n.config.date.formats.same_day,
              lastDay: i18n.config.date.formats.last_day,
              nextDay: i18n.config.date.formats.next_day,
              lastWeek: i18n.config.date.formats.last_week,
              nextWeek: i18n.config.date.formats.next_week,
              sameElse: i18n.config.date.presets.datetime,
            })
          case 'money':
            const value = _isObject(param) ? param.value : param
            const defaultFormat = i18n.config.number.formats.amounts.default

            let result = numeral(value).format(defaultFormat)

            // for very large numbers numeral returns NaN, so
            // we use custom regex formatter
            if (result === 'NaN') {
              result = formatNumberCustom(value)
            }

            return param.currency ? result.concat(' ', param.currency) : result
          case 'number':
            let formattedNumber = numeral(param).format(
              i18n.config.number.formats.default
            )

            // for very large numbers numeral returns NaN, so
            // we use custom regex formatter
            if (formattedNumber === 'NaN') {
              formattedNumber = formatNumberCustom(value)
            }

            return formattedNumber
          case 'order_number':
            return numeral(param).format(
              i18n.config.number.formats.order_number
            )
          case 'integer':
            return numeral(param).format(
              i18n.config.number.formats.integer
            )
          case 'percent':
            return numeral(param).format(
              i18n.config.number.formats.percent
            )
          default:
            console.warn(`Unknown format: ${format}, skipping..`)
            return param
        }
      },
    },
  }
}

function formatNumberCustom (value) {
  const numberParts = value.toString().split('.')

  const fractionalPart = numberParts[0]
    // remove leading zeros
    .replace(/^0+(\d)/g, '$1')
    // separate thousands by ','
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

  const decimalPart = numberParts[1] &&
    // remove trailing zeros
    numberParts[1].replace(/0+$/g, '')

  return decimalPart ? `${fractionalPart}.${decimalPart}` : fractionalPart
}

const lang = 'en'
export const i18nOptions = buildI18nOptions(
  lang,
  buildI18n(lang)
)

export function mergeIntoI18nOptions (...localesJson) {
  Object.assign(
    i18nOptions,
    buildI18nOptions(
      lang,
      buildI18n(lang, ...localesJson)
    )
  )
}
