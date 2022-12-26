import { MathUtil } from '@/js/utils'

export function formatMoney ({
  value,
  currency,
}) {
  const cfg =
  ({
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    decimalPlaces: 6,
  })

  const result = value
    ? MathUtil.format(value, cfg)
    : '0'
  return currency
    ? result.concat(' ', currency)
    : result
}
