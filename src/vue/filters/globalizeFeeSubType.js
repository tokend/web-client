import i18next from 'i18next'

const FEE_SUBTYPE_TRANSLATION_CODES = Object.freeze({
  0: 'fee.incoming-outgoing',
  1: 'fee.outgoing',
  2: 'fee.incoming'
})

export function globalizeFeeSubType (subtype) {
  return i18next.t(FEE_SUBTYPE_TRANSLATION_CODES[subtype])
}
