import i18next from 'i18next'

export function formatPercent (value) {
  return i18next.t('formats.percent', { value: value / 100 })
}
