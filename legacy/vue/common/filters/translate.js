import { polyglot } from 'L@/js/i18n'

export function translate (translationId, interpolations) {
  return polyglot.t(translationId, interpolations)
}
