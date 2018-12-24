import i18next from 'i18next'

export function formatFeeType (value) {
  return i18next.t('formats.fee_type', { value })
}
