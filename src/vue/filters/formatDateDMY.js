import i18next from 'i18next'

export function formatDateDMY (value) {
  return i18next.t('formats.dmy', { value })
}
