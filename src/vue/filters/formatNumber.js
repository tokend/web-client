import { globalize } from './globalize'

export function formatNumber (value) {
  return globalize('formats.number', { value })
}
