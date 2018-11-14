export function localizeNum (value, digits = 6, collapse = true) {
  if (!value) value = 0
  const parts = parseFloat(this.roundDown(Number(value), digits)).toFixed(digits).split('.')
  const localized = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '')
  if (!collapse) {
    return localized
  } else {
    if (+value < 100000) return localized
    return formatBigNumber(value)
  }
}

export function formatBigNumber (number, digits = 0) {
  const num = parseFloat(number)
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
    }
  }
  return num.toFixed(digits).replace(rx, '$1')
}

export function localizeBase (value) {
  return localizeNum(value)
}

export function localizeQuote (value) {
  return localizeNum(value, 2)
}

export function localize (value) {
  return localizeNum(value)
}
