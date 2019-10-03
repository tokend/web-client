import WAValidator from 'wallet-address-validator'
import cardValidator from 'card-validator'

import { base } from '@tokend/js-sdk'

import { MathUtil } from '@/js/utils'

import * as validators from 'vuelidate/lib/validators'

const ASSETS = {
  btc: 'BTC',
  eth: 'ETH',
}

export { minLength } from 'vuelidate/lib/validators'

export const password = value => validators.minLength(6)(value)
export const seed = value => base.Keypair.isValidSecretKey(value)
export const amount = value => Number(value) && Number(value) > 0

export const amountRange = (from, to) => value =>
  !validators.helpers.req(value) || (
    MathUtil.compare(value, from) >= 0 &&
    MathUtil.compare(to, value) >= 0
  )

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

export const telegramUsername = value => {
  return /^[a-zA-Z0-9_-]{3,16}$/.test(value)
}
export const emailOrPhoneNumberOrTelegram = value => {
  return validateEmail(value) ||
    validatePhoneNumber(value) ||
    telegramUsername(value)
}
export const accountId = value => {
  return base.Keypair.isValidPublicKey(value)
}

export const noMoreThanAvailableOnBalance = balance => value => {
  return MathUtil.compare(balance, value) >= 0
}

export const maxValueBig = max => value => {
  return MathUtil.compare(value, max) <= 0
}

export * from 'vuelidate/lib/validators'

export function validateEmail (email) {
  const reg = new RegExp('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
  return reg.test(email)
}

export const cardNumber = value => {
  /**
   * {String} value
   * {Object} [opts]
   * @returns {Object}
   */
  return cardValidator.number(value).isValid
}

export const validateUrl = url => {
  // eslint-disable-next-line
  const reg = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
  return reg.test(url)
}

export const validatePhoneNumber = value => {
  return /^[1-9]{1}[0-9]{3,14}$/i.test(value)
}
