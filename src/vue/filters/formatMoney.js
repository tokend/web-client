import { globalize } from './globalize'

export function formatMoney (value) {
  return globalize('formats.money', { value })
}
