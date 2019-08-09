import BigNumber from 'bignumber.js'

const ROUNDING_MODES = Object.freeze({
  ROUND_UP: 0,
  ROUND_DOWN: 1,
  ROUND_CEIL: 2,
  ROUND_FLOOR: 3,
  ROUND_HALF_UP: 4,
  ROUND_HALF_DOWN: 5,
  ROUND_HALF_EVEN: 6,
  ROUND_HALF_CEIL: 7,
  ROUND_HALF_FLOOR: 8,
})

const ONE = 1000000
const DECIMAL_PLACES = 2
const MAX_ALLOWED_PERCENT = 100

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

    const result = one.minus(two)
    return result
      .toFixed(DECIMAL_PLACES)
  }

  static add (a, b, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
    if (!this._isValidParams('add', a, b)) return 0

    BigNumber.config({ ROUNDING_MODE: ROUND_TYPE })
    BigNumber.config({ DECIMAL_PLACES })

    const one = new BigNumber(a)
    const two = new BigNumber(b)

    const result = one.plus(two)
    return result
      .toFixed(DECIMAL_PLACES)
  }

  // a > b => 1
  // a < b => -1
  // a === b => 0
  static compare (a, b) {
    if (!this._isValidParams('comparedTo', a, b)) return -1

    const one = new BigNumber(a)
    const two = new BigNumber(b)

    return one.comparedTo(two)
  }

  /**
   * Formats value by provided config.
   *
   * @param {Number|String} value Number to format.
   * @param {Object} config Format config.
   * @param {Number} config.decimalPlaces Number of decimal places to round.
   * @param {String} [config.prefix] String to prepend.
   * @param {String} [config.decimalSeparator] Decimal separator.
   * @param {String} [config.groupSeparator] Grouping separator of
   *                                         the integer part.
   * @param {Number} [config.groupSize] Primary grouping size of
   *                                    the integer part.
   * @param {Number} [config.secondaryGroupSize] Secondary grouping size of
                                                 the integer part.
   * @param {String} [config.fractionGroupSeparator] Grouping separator of
                                                     the fraction part.
   * @param {Number} [config.fractionGroupSize] Grouping size of
                                                the fraction part.
   * @param {String} [config.suffix] String to append.

   * @returns {String} Formatted string
   */
  static format (value, config) {
    BigNumber.config({ FORMAT: config })

    const num = new BigNumber(value)
    const result = new BigNumber(
      num.toFixed(config.decimalPlaces, ROUNDING_MODES.ROUND_HALF_UP)
    )

    return result.toFormat()
  }

  /**
   * Example: value = 200, percent = 15. Return - 30
   *
   * @param {Number|String} value
   * @param {Number|String} percent
   * @param {ROUND_TYPE} [ROUND_TYPE]
   * @returns percentage of the passed value
   */
  static percentOfValue (value, percent, ROUND_TYPE = ROUNDING_MODES.ROUND_UP) {
    const number = new BigNumber(value)
    const percentValue = MathUtil.divide(percent, MAX_ALLOWED_PERCENT)
    return MathUtil.multiply(number, percentValue)
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

  static get roundingModes () {
    return ROUNDING_MODES
  }
}
