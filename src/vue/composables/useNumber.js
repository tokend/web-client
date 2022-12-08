import { MathUtil } from '@/js/utils'

export const useNumber = () => {
  const formatNumber = (
    number,
    decimalPlaces = 0,
  ) => {
    const cfg =
    ({
      decimalSeparator: '.',
      groupSeparator: '',
      groupSize: 3,
      decimalPlaces,
    })

    return MathUtil.format(
      number,
      cfg,
    )
  }

  return {
    formatNumber,
  }
}
