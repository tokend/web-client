import { base } from '@tokend/js-sdk'

export const DEFAULT_PRECISION =
  String(base.Operation.ONE || 1000000).match(/0/g).length
export const DEFAULT_INPUT_STEP = `0.${'0'.repeat(DEFAULT_PRECISION - 1)}1`
export const DEFAULT_MIN_AMOUNT = String(1 / base.Operation.ONE || 1000000)
export const DEFAULT_MAX_AMOUNT = base.Operation.MAX_INT64_AMOUNT
export const DEFAULT_CONVERSION_ASSET = 'USD'
export const DEFAULT_CONVERSION_PRECISION = 2
