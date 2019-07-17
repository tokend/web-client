import { globalize } from './globalize'

export function formatDateDMYT (value) {
  return globalize('formats.dmyt', { value })
}
