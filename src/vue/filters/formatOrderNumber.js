import i18next from 'i18next'

export function formatOrderNumber (value) {
  return i18next.t('formats.order_number', { value })
}
