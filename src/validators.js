import WAValidator from 'wallet-address-validator'
import moment from 'moment'
// IBAN is an abbreviation for International Bank Account Number
import iban from 'iban'
import cardValidator from 'card-validator'

import { base } from '@tokend/js-sdk'

import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import * as validators from 'vuelidate/lib/validators'

const ASSETS = {
  btc: 'BTC',
  eth: 'ETH',
}

export { minLength } from 'vuelidate/lib/validators'

export const password = value => validators.minLength(6)(value)
export const seed = value => base.Keypair.isValidSecretKey(value)
export const amount = value => Number(value) && Number(value) > 0
export const requiredAtLeastOne = value => !!value.length
export const maxDecimalPoints = points => value => {
  const splittedValue = value.split('.')
  if (splittedValue.length < 2) {
    return true
  } else {
    return splittedValue[splittedValue.length - 1].length <= Number(points)
  }
}
export const amountRange = (from, to) => value =>
  !validators.helpers.req(value) || (
    Number(value) &&
    Number(value) >= Number(from) &&
    Number(value) <= Number(to)
  )
export const minDate = (minDate) => value => {
  return moment(value).isAfter(moment(minDate))
}
export const address = (asset) => value => {
  switch (asset) {
    case ASSETS.btc:
      return WAValidator.validate(value, ASSETS.btc, 'both')
    case ASSETS.eth:
      return /^(0x)?[0-9a-f]{40}$/i.test(value)
    default:
      return true
  }
}
export const emailOrAccountId = value => {
  return validateEmail(value) || base.Keypair.isValidPublicKey(value)
}
export const documentContainer = value => value instanceof DocumentContainer

export const noMoreThanAvailableOnBalance = balance => value => {
  return +balance >= +value
}
export const maxDecimalDigitsCount = maxDecimalDigitsCount => value => {
  const [, decimals] = String(value).split('.')
  if (decimals) {
    return decimals.length <= maxDecimalDigitsCount
  } else {
    return true
  }
}
export const ibanValidator = value => {
  return iban.isValid(value)
}

export * from 'vuelidate/lib/validators'

export function validateEmail (email) {
  const reg = new RegExp('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
  return reg.test(email)
}

export const creditCardNumber = value => {
  /**
   * {String} value
   * {Object} [opts]
   * @returns {Object}
   */
  return cardValidator.number(value).isValid
}

export const creaditCardExpirationDate = value => {
  const DEFAULT_YEAR_AHEAD = 20

  /**
   * {String|Object} value
   * {Integer} [maxElapsedYear]
   * @returns {Object}
   */
  return cardValidator.expirationDate(
    value,
    DEFAULT_YEAR_AHEAD,
  ).isValid
}

export const creditCardCVV3 = value => {
  const DEFAULT_CVV_LENGTH = 3

  /**
   * {String} value
   * {Integer} [maxLength]
   * @returns {Object}
   */
  return cardValidator.cvv(
    value,
    DEFAULT_CVV_LENGTH,
  ).isValid
}
