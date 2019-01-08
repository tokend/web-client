import { base } from '@tokend/js-sdk'
import * as validators from 'vuelidate/lib/validators'
export { minLength } from 'vuelidate/lib/validators'

export const password = value => validators.minLength(6)(value)
export const seed = value => base.Keypair.isValidSecretKey(value)
export const amountRange = (from, to) => value => Number(value) &&
  Number(value) >= from && Number(value) <= to

export * from 'vuelidate/lib/validators'
