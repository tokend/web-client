import i18next from 'i18next'

export function formatNumber (value) {
  return i18next.t('formats.number', { value })
}
