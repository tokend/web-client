import { base } from '@tokend/js-sdk'

export const config = Object.freeze({
  MIN_AMOUNT: String(1 / (base.Operation.ONE || 1000000)),
  MAX_AMOUNT: String(base.Operation.MAX_INT64_AMOUNT),
  DECIMAL_POINTS: 6,
})
