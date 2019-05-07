import { base } from '@tokend/js-sdk'

export const config = Object.freeze({
  MIN_AMOUNT: String(1 / (base.Operation.ONE || 1000000)),
  DECIMAL_POINTS: 6,
})
