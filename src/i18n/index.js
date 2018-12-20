import moment from 'moment'
import numeral from 'numeral'

import _isObject from 'lodash/isObject'

import { FEE_TYPES } from '@tokend/js-sdk'
import {
  FEE_TYPE_TRANSLATION_CODES,
  PAYMENT_FEE_SUBTYPE_TRANSLATION_CODES
} from '@/js/const/fee-translation-codes.const'

const language = 'en'
let i18n

switch (language) {
  case 'en':
    i18n = require(`./en`)
    break
  default:
    throw new Error('Locale not found')
}

export const i18nOptions = {
  lng: language,
  debug: false,
  resources: {
    en: {
      translation: {
        ...i18n.translations
      }
    }
  },
  whitelist: ['en'],
  // set to true if you need en-US/en-UK lng's:
  nonExplicitWhitelist: false,
  interpolation: {
    format: (param, format) => {
      switch (format.toLowerCase()) {
        case 'date':
          return moment(param).format(i18n.config.date.presets.datetime)
        case 'calendar':
          return moment(param).calendar(null, {
            sameDay: i18n.config.date.formats.same_day,
            lastDay: i18n.config.date.formats.last_day,
            nextDay: i18n.config.date.formats.next_day,
            lastWeek: i18n.config.date.formats.last_week,
            nextWeek: i18n.config.date.formats.next_week,
            sameElse: i18n.config.date.presets.datetime
          })
        case 'money':
          const formats = i18n.config.number.formats.amounts
          if (!_isObject(param)) {
            return numeral(param)
              .format(formats.default)
          } else if (formats[param.currency.toLowerCase()]) {
            return numeral(param.value)
              .format(formats[param.currency.toLowerCase()])
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
        case 'fee_type':
          const feeTypeLabel = FEE_TYPE_TRANSLATION_CODES[param]
          return i18n.translations['fee-types'][feeTypeLabel]
        case 'fee_subtype':
          const isPaymentFeeType = param.type === FEE_TYPES.paymentFee
          let feeSubtypeLabel = isPaymentFeeType
            ? PAYMENT_FEE_SUBTYPE_TRANSLATION_CODES[param.subtype]
            : 'incoming-outgoing'
          return i18n.translations['fee-types'][feeSubtypeLabel]
        default:
          console.warn(`Unknown format: ${format}, skipping..`)
          return param
      }
    }
  }
}
