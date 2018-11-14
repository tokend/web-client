import { translate } from './translate'

const FEE_TYPE = {
  0: translate('fees_payment_fee'),
  1: translate('fees_offer_fee'),
  2: translate('fees_withdrawal_fee'),
  3: translate('fees_issuance_fee'),
  4: translate('fees_invest_fee')
}

export function localizeFeeType (type) {
  return FEE_TYPE[type + '']
}
