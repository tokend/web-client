import { globalize } from './globalize'

export function formatInteger (value) {
  return globalize('formats.integer', { value })
}
