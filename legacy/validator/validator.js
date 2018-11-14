import * as libphonenumber from 'libphonenumber-js'
import { Keypair } from 'tokend-js-sdk'
import { validateAddress } from './address_validation'
import { i18n } from '../js/i18n/index'
const rules = [
  {
    name: 'phone_number',
    message: 'Invalid number',
    validate: value => libphonenumber.isValidNumber(libphonenumber.parse(value))
  },
  {
    name: 'strong_password',
    message: 'Password must have a-z, A-Z and 0-9',
    validate: value => {
      let isValid = true
      isValid = isValid && Boolean(value.match(/([a-z])/g))
      isValid = isValid && Boolean(value.match(/([0-9])/g))
      isValid = isValid && !(value.match(/([ ])/g))
      return isValid
    }
  },
  {
    name: 'account_id',
    message: 'Here must be a valid account id',
    validate: value => Keypair.isValidPublicKey(value)
  },
  {
    name: 'secret_key',
    message: 'Here must be a valid secret key',
    validate: value => Keypair.isValidSecretKey(value)
  },
  {
    name: 'email_or_account_id',
    message: 'Here must be a valid email or account id',
    validate: value => validateEmail(value) || Keypair.isValidPublicKey(value)
  },
  {
    name: 'amount',
    message: 'Amount must be a number, greater than 0',
    validate: value => Number(value) && Number(value) > 0
  },
  {
    name: 'wallet_address',
    message: 'Invalid wallet address',
    validate: value => validateAddress(value)
  },
  {
    name: 'soft_cap',
    getMessage: (field, [cap]) => `Value should be bigger than soft cap: ${i18n.cc(cap)}`,
    validate: (value, [cap]) => +value >= +cap
  },
  {
    name: 'max_issuance',
    getMessage: (field, [max, code]) => `You cant sell more tokens than you have. Available: ${i18n.c(max)} ${code}`,
    validate: (value, [max]) => +value <= +max
  }
]

/**
 *
 * @param {object} validator - vee-validate validator object to add rules
 */
export function extendValidator (validator) {
  addCustomRulesToValidator(validator)
  return validator
}

/**
 *
 * @param {object} validator - vee-validate validator object to add rules
 */
function addCustomRulesToValidator (validator) {
  rules.forEach(rule => {
    validator.extend(rule.name, {
      getMessage: rule.getMessage || (_ => rule.message),
      validate: rule.validate
    })
  })
  return validator
}

export function validateEmail (email) {
  const reg = new RegExp('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
  return reg.test(email)
}

export function validateAccountId (accountId) {
  return Keypair.isValidPublicKey(accountId)
}
