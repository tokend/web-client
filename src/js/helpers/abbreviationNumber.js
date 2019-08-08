import { MathUtil } from '@/js/utils'
import { globalize } from '@/vue/filters/globalize'

const DECIMAL_PLACES = 2

export function abbreviationNumber (value, format) {
  if (value <= 1000) {
    return MathUtil.format(value, format)
  }
  // 2 decimal places
  const decimalPlaces = Math.pow(10, DECIMAL_PLACES)
  let abbreviation = [
    globalize('abbreviation-numbers.thousand'),
    globalize('abbreviation-numbers.million'),
    globalize('abbreviation-numbers.billion'),
    globalize('abbreviation-numbers.trillion'),
  ]

  for (let i = abbreviation.length - 1; i >= 0; i--) {
    let size = Math.pow(10, (i + 1) * 3)
    if (size <= value) {
      const multiplyValue = MathUtil.multiply(value, decimalPlaces)
      const divideValue = MathUtil.divide(multiplyValue, size)
      const roundValue = MathUtil.round(divideValue)
      value = MathUtil.divide(roundValue, decimalPlaces)
      value += abbreviation[i]

      break
    }
  }

  return value
}
