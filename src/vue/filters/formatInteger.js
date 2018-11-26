import i18next from 'i18next'

export function formatInteger (value) {
  return i18next.t('formats.integer', { value })
}
