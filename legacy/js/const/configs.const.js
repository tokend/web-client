import { Operation } from 'tokend-js-sdk'

/* eslint-disable max-len */
export const DEFAULT_PRECISION = String(Operation.ONE || 1000000).match(/0/g).length
export const DEFAULT_INPUT_STEP = `0.${'0'.repeat(DEFAULT_PRECISION - 1)}1`
export const DEFAULT_MAX_AMOUNT = Operation.MAX_INT64_AMOUNT
export const DEFAULT_CONVERSION_ASSET = 'USD'
export const DEFAULT_CONVERSION_PRESICION = 2
/* eslint-enable max-len */
