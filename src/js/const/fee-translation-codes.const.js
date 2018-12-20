import { FEE_TYPES, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'

export const FEE_TYPE_TRANSLATION_CODES = Object.freeze({
  [FEE_TYPES.paymentFee]: 'payment',
  [FEE_TYPES.offerFee]: 'offer',
  [FEE_TYPES.withdrawalFee]: 'withdrawal',
  [FEE_TYPES.issuanceFee]: 'issuance',
  [FEE_TYPES.investFee]: 'invest',
  [FEE_TYPES.capitalDeploymentFee]: 'capital-deployment',
  [FEE_TYPES.operationFee]: 'operation',
  [FEE_TYPES.payoutFee]: 'payout'
})

export const PAYMENT_FEE_SUBTYPE_TRANSLATION_CODES = Object.freeze({
  [PAYMENT_FEE_SUBTYPES.outgoing]: 'outgoing',
  [PAYMENT_FEE_SUBTYPES.incoming]: 'incoming'
})
