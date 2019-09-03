import config from '@/config'

export function inputStepByDigitsCount (count) {
  const defaultStr = '0'
  if (+count > 0 && +count <= config.MAX_SYSTEM_DECIMAL_POINTS) {
    return `${defaultStr}.${'1'.padStart(+count, '0')}`
  } else if (+count === 0) {
    return defaultStr
  } else if (+count > config.MAX_SYSTEM_DECIMAL_POINTS || +count < 0) {
    throw new Error(`Trailing digits count for this asset should be non-negative and less than ${config.MAX_SYSTEM_DECIMAL_POINTS}`)
  }
}

export function isValidValueByDigitsCount (value, count) {
  const regExp = new RegExp(`^\\d+(?:\\.\\d{0,${count}})?$`)
  return regExp.test(value)
}
