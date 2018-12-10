import * as validators from 'vuelidate/lib/validators'
export * from 'vuelidate/lib/validators'

export const password = value => validators.minLength(6)(value)

export * from 'vuelidate/lib/validators'
