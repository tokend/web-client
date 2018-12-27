import { base } from '@tokend/js-sdk'
import * as validators from 'vuelidate/lib/validators'
export { minLength } from 'vuelidate/lib/validators'

export const password = value => validators.minLength(6)(value)
export const seed = value => base.Keypair.isValidSecretKey(value)
export const amount = value => Number(value) && Number(value) > 0
export const maxValueWrapper = value => {
  return !validators.helpers.req(value()) || validators.maxValue(value())
}

export * from 'vuelidate/lib/validators'
