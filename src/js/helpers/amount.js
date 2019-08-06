import config from '@/config'

export function amountToPrecision (amount, precision = config.DECIMAL_POINTS) {
  const digits = Math.pow(10, precision)
  return (+amount)
    ? String(Math.floor(parseFloat(amount) * digits) / digits)
    : parseFloat(amount).toFixed(precision)
}
