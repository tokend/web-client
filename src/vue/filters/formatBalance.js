import { globalize } from './globalize'

export function formatBalance (value) {
  return globalize('formats.balance', { value })
}
