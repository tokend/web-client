import { ROUNDING_MODES } from '../const/const'

const BigNumber = require('bignumber.js')

const ONE = 1000000
const DECIMAL_PLACES = 6

export function bigDivide (a, b, c, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
  if (!isValidParams('big-divide', a, b, c)) return 0

  BigNumber.config({ ROUNDING_MODE: ROUND_TYPE })
  BigNumber.config({ DECIMAL_PLACES: 0 })

  const num1 = new BigNumber(a * ONE)
  const num2 = new BigNumber(b * ONE)
  const denum = new BigNumber(c * ONE)
  const num = num1.times(num2)
  const result = num.dividedBy(denum)

  BigNumber.config({ DECIMAL_PLACES })
  return result.dividedBy(ONE).toFixed(DECIMAL_PLACES)
}

export function multiply (a, b, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
  if (!isValidParams('big-multiply', a, b)) return 0

  BigNumber.config({ ROUNDING_MODE: ROUND_TYPE })
  BigNumber.config({ DECIMAL_PLACES: 0 })

  const mul1 = new BigNumber(new BigNumber(a).times(new BigNumber(ONE)))
  const mul2 = new BigNumber(new BigNumber(b).times(new BigNumber(ONE)))
  const result = mul1.times(mul2)

  BigNumber.config({ DECIMAL_PLACES })

  return result
    .dividedBy(new BigNumber(ONE))
    .dividedBy(new BigNumber(ONE))
    .toFixed(DECIMAL_PLACES)
}

export function divide (a, b, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
  if (!isValidParams('big-divide', a, b)) return 0

  BigNumber.config({ ROUNDING_MODE: ROUND_TYPE })
  BigNumber.config({ DECIMAL_PLACES })

  const num = new BigNumber(new BigNumber(a).times(new BigNumber(ONE)))
  const denum = new BigNumber(new BigNumber(b).times(new BigNumber(ONE)))

  const result = num.dividedBy(denum)

  return result.toFixed(DECIMAL_PLACES)
}

export function add (a, b, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
  if (!isValidParams('add', a, b)) return 0

  BigNumber.config({ ROUNDING_MODE: ROUND_TYPE })
  BigNumber.config({ DECIMAL_PLACES })

  const one = new BigNumber(a)
  const two = new BigNumber(b)

  const result = one.add ? one.add(two) : one.plus(two)

  return result.toFixed(DECIMAL_PLACES)
}

export function subtract (a, b, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
  if (!isValidParams('subtract', a, b)) return 0

  BigNumber.config({ ROUNDING_MODE: ROUND_TYPE })
  BigNumber.config({ DECIMAL_PLACES })

  const one = new BigNumber(a)
  const two = new BigNumber(b)

  const result = one.sub ? one.sub(two) : one.minus(two)
  return result.toFixed(DECIMAL_PLACES)
}

function isValidParams (op, a, b, c = 0) {
  try {
    BigNumber(a)
    BigNumber(b)
    BigNumber(c)
  } catch (err) {
    return false
  }
  return true
}
