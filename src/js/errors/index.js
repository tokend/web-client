import * as runtimeErrors from './runtime-errors'
import { errors as sdkErrors } from '@tokend/js-sdk'

const errors = {
  ...sdkErrors,
  ...runtimeErrors,
}

export { runtimeErrors, sdkErrors, errors }
