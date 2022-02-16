import { BigNumber } from 'bignumber.js'

export enum ROUNDING_MODES {
  ROUND_UP = 0,
  ROUND_DOWN = 1,
  ROUND_CEIL = 2,
  ROUND_FLOOR = 3,
  ROUND_HALF_UP = 4,
  ROUND_HALF_DOWN = 5,
  ROUND_HALF_EVEN = 6,
  ROUND_HALF_CEIL = 7,
  ROUND_HALF_FLOOR = 8,
}

export class MathUtil {
  // FIXME
  static format (
    value: string,
    config?: BigNumber.Config,
    isFixed = true,
  ): string {
    if (config) {
      BigNumber.config(config)
    }

    const num = new BigNumber(value)

    const result = new BigNumber(
      config?.DECIMAL_PLACES
        ? num.toFixed(config?.DECIMAL_PLACES)
        : num.toFixed(),
    )

    return isFixed
      ? result.toFixed()
      : result.toFormat(config?.DECIMAL_PLACES)
  }

  static shiftAmount (amount: string, shiftAmount: number): string {
    const result = new BigNumber(amount)

    return result.shiftedBy(shiftAmount).toFixed()
  }

  static get roundingModes (): typeof ROUNDING_MODES {
    return ROUNDING_MODES
  }

  static compare (firstVal: string, secondVal: string) {
    const firstBN = new BigNumber(firstVal)
    const secondBN = new BigNumber(secondVal)

    return firstBN.comparedTo(secondBN)
  }
}
