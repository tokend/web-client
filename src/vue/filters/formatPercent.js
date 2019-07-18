import { globalize } from './globalize'

export function formatPercent (value) {
  return globalize('formats.percent', { value: value / 100 })
}
