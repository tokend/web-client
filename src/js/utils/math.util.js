const BigNumber = require('bignumber.js')

const ROUNDING_MODES = Object.freeze({
  ROUND_UP: 0,
  ROUND_DOWN: 1,
  ROUND_CEIL: 2,
  ROUND_FLOOR: 3,
  ROUND_HALF_UP: 4,
  ROUND_HALF_DOWN: 5,
  ROUND_HALF_EVEN: 6,
  ROUND_HALF_CEIL: 7,
  ROUND_HALF_FLOOR: 8
})

const ONE = 1000000
const DECIMAL_PLACES = 6

export class MathUtil {
  static multiply (a, b, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
    if (!this._isValidParams('big-multiply', a, b)) return 0

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

  static divide (a, b, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
    if (!this._isValidParams('big-divide', a, b)) return 0

    BigNumber.config({ ROUNDING_MODE: ROUND_TYPE })
    BigNumber.config({ DECIMAL_PLACES })

    const num = new BigNumber(new BigNumber(a).times(new BigNumber(ONE)))
    const denum = new BigNumber(new BigNumber(b).times(new BigNumber(ONE)))

    const result = num.dividedBy(denum)

    return result
      .toFixed(DECIMAL_PLACES)
  }

  static subtract (a, b, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
    if (!this._isValidParams('subtract', a, b)) return 0

    BigNumber.config({ ROUNDING_MODE: ROUND_TYPE })
    BigNumber.config({ DECIMAL_PLACES })

    const one = new BigNumber(a)
    const two = new BigNumber(b)

    const result = one.sub(two)
    return result
      .toFixed(DECIMAL_PLACES)
  }

  static add (a, b, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
    if (!this._isValidParams('add', a, b)) return 0

    BigNumber.config({ ROUNDING_MODE: ROUND_TYPE })
    BigNumber.config({ DECIMAL_PLACES })

    const one = new BigNumber(a)
    const two = new BigNumber(b)

    const result = one.add(two)
    return result
      .toFixed(DECIMAL_PLACES)
  }

  static _isValidParams (op, a, b, c = 0) {
    try {
      BigNumber(a)
      BigNumber(b)
      BigNumber(c)
    } catch (err) {
      return false
    }
    return true
  }

  static round (n) {
    return Math.round(n)
  }
}
