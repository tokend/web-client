import i18next from 'i18next'

const FEE_SUBTYPE = Object.freeze({
  0: 'fee.incoming_outgoing',
  1: 'fee.outgoing',
  2: 'fee.incoming'
})

export function localizeFeeSubType (subtype) {
  return i18next.t(FEE_SUBTYPE[subtype])
}
