import i18next from 'i18next'

export function globalize (translationId, interpolationOps) {
  return i18next.t(translationId, interpolationOps)
}
