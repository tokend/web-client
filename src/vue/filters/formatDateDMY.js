import { globalize } from './globalize'

export function formatDateDMY (value) {
  return globalize('formats.dmy', { value })
}
