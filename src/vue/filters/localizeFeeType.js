import { globalize } from '@/vue/filters/globalize'

const FEE_TYPE = {
  0: 'fee.payment_fee',
  1: 'fee.offer_fee',
  2: 'fee.withdrawal_fee',
  3: 'fee.issuance_fee',
  4: 'fee.invest_fee',
  5: 'fee.capital_deployment_fee',
  6: 'fee.operation_fee',
  7: 'fee.invest_fee'
}

export function localizeFeeType (type) {
  return globalize(FEE_TYPE[type])
}
