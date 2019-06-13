import moment from 'moment-timezone'

import _isObject from 'lodash/isObject'
import _merge from 'lodash/merge'

import { MathUtil } from '@/js/utils'

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
          case 'dmyt':
            return moment(param).format(i18n.config.date.presets.dmyt)
          case 'calendar':
            return moment(param).calendar(null, {
              sameDay: i18n.config.date.formats.same_day,
              lastDay: i18n.config.date.formats.last_day,
              nextDay: i18n.config.date.formats.next_day,
              lastWeek: i18n.config.date.formats.last_week,
              nextWeek: i18n.config.date.formats.next_week,
              sameElse: i18n.config.date.presets.datetime,
            })
          case 'calendar-inline':
            return moment(param).calendar(null, {
              sameDay: i18n.config.date.formats.same_day_inline,
              lastDay: i18n.config.date.formats.last_day_inline,
              nextDay: i18n.config.date.formats.next_day_inline,
              lastWeek: i18n.config.date.formats.last_week_inline,
              nextWeek: i18n.config.date.formats.next_week_inline,
              sameElse: i18n.config.date.presets.datetime,
            })
          case 'money':
            const value = (_isObject(param) ? param.value : param) || '0'
            const defaultFormat = i18n.config.number.formats.amounts.default

            const result = MathUtil.format(value, defaultFormat)
            return param.currency ? result.concat(' ', param.currency) : result
          case 'number':
            return MathUtil.format(param, i18n.config.number.formats.default)
          case 'integer':
            return MathUtil.format(param, i18n.config.number.formats.integer)
          case 'percent':
            const convertedPercent = MathUtil.multiply(param, 100)
            return MathUtil.format(
              convertedPercent, i18n.config.number.formats.percent
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
