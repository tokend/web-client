import { OP_TYPES } from '@tokend/js-sdk'

export const LOCALIZED_OPERATION_TYPE_KEY = Object.freeze({
  [OP_TYPES.createIssuanceRequest]: 'issuance',
  [OP_TYPES.createWithdrawalRequest]: 'withdrawal',
  [OP_TYPES.paymentV2]: 'transfer',
  [OP_TYPES.manageOffer]: 'oder-match',
  [OP_TYPES.checkSaleState]: 'investment'
})
