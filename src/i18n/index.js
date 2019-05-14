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
        require(`./en.preIssuanceGuide`),
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
            const formats = i18n.config.number.formats.amounts
            if (!_isObject(param)) {
              return numeral(param)
                .format(formats.default)
            } else if (formats[(param.currency || '').toLowerCase()]) {
              return numeral(param.value)
                .format(formats[(param.currency || '').toLowerCase()])
            } else {
              return numeral(param.value)
                .format(formats.default)
                .concat(' ', param.currency)
            }
          case 'number':
            return numeral(param).format(
              i18n.config.number.formats.default
            )
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
