import i18next from 'i18next'

export function formatFeeSubType (value) {
  return i18next.t('formats.fee_subtype', { value })
}
