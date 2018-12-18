import i18next from 'i18next'

const FEE_TYPE_TRANSLATION_CODES = Object.freeze({
  0: 'fee.payment-fee',
  1: 'fee.offer-fee',
  2: 'fee.withdrawal-fee',
  3: 'fee.issuance-fee',
  4: 'fee.invest-fee',
  5: 'fee.capital-deployment-fee',
  6: 'fee.operation-fee',
  7: 'fee.payout-fee'
})

export function globalizeFeeType (type) {
  return i18next.t(FEE_TYPE_TRANSLATION_CODES[type])
}
