import { globalize } from './globalize'

export function formatCalendar (value) {
  return globalize('formats.calendar-inline', { value })
}
