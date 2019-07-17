import { i18n } from '@/i18n'

export function globalize (translationId, interpolationOps) {
  return i18n.t(translationId, interpolationOps)
}
