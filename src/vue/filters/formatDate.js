import { globalize } from './globalize'

export function formatDate (value) {
  return globalize('formats.date', { value })
}
