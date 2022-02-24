import { globalize } from './globalize'

export function formatCalendarInline (value) {
  return globalize('formats.calendar-inline', { value })
}
