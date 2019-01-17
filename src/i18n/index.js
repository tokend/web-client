import moment from 'moment'
import numeral from 'numeral'

import i18next from 'i18next'

import _isObject from 'lodash/isObject'

import { FEE_TYPES, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'

const FEE_TYPE_TRANSLATION_CODES = Object.freeze({
  [FEE_TYPES.paymentFee]: 'fee-types.payment',
  [FEE_TYPES.offerFee]: 'fee-types.offer',
  [FEE_TYPES.withdrawalFee]: 'fee-types.withdrawal',
  [FEE_TYPES.issuanceFee]: 'fee-types.issuance',
  [FEE_TYPES.investFee]: 'fee-types.invest',
  [FEE_TYPES.capitalDeploymentFee]: 'fee-types.capital-deployment',
  [FEE_TYPES.operationFee]: 'fee-types.operation',
  [FEE_TYPES.payoutFee]: 'fee-types.payout',
})

const PAYMENT_FEE_SUBTYPE_TRANSLATION_CODES = Object.freeze({
  [PAYMENT_FEE_SUBTYPES.outgoing]: 'fee-types.outgoing',
  [PAYMENT_FEE_SUBTYPES.incoming]: 'fee-types.incoming',
})

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
          const feeTypeTranslationId = FEE_TYPE_TRANSLATION_CODES[param]
          return i18next.t(feeTypeTranslationId)
        case 'fee_subtype':
          const isPaymentFeeType = param.type === FEE_TYPES.paymentFee
          const feeSubtypeTranslationId = isPaymentFeeType
            ? PAYMENT_FEE_SUBTYPE_TRANSLATION_CODES[param.subtype]
            : 'fee-types.incoming-outgoing'
          return i18next.t(feeSubtypeTranslationId)
        default:
          console.warn(`Unknown format: ${format}, skipping..`)
          return param
      }
    },
  },
}
