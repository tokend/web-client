import i18next from 'i18next'

export function formatDate (value) {
  return i18next.t('formats.date', { value })
}
