import i18next from 'i18next'

export function formatMoney (value) {
  return i18next.t('formats.money', { value })
}
