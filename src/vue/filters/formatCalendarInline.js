import i18next from 'i18next'

export function formatCalendar (value) {
  return i18next.t('formats.calendar-inline', { value })
}
