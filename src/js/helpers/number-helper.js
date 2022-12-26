import { MathUtil } from '@/js/utils'

export function formatNumber (
  number,
  decimalPlaces = 0,
  suffix = 0,
) {
  const cfg =
  ({
    decimalSeparator: '.',
    groupSeparator: '',
    groupSize: 3,
    suffix,
    decimalPlaces,
  })
  return MathUtil.format(
    number,
    cfg,
  )
}
