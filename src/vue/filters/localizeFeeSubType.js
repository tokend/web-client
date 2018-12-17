import { globalize } from '@/vue/filters/globalize'

const FEE_SUBTYPE = Object.freeze({
  0: 'my-fee-page.incoming_outgoing',
  1: 'my-fee-page.outgoing',
  2: 'my-fee-page.incoming'
})

export function localizeFeeSubType (subtype) {
  return globalize(FEE_SUBTYPE[subtype])
}
