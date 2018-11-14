import { xdrEnumToConstant } from '../utils/xdr_enum_to_constant.util'
import { xdr } from 'tokend-js-sdk'

export const REQUEST_TYPES = Object.freeze(
  xdrEnumToConstant('ReviewableRequestType')
)

export const FEE_TYPES = Object.freeze(
  xdrEnumToConstant('FeeType')
)

export const PAYMENT_FEE_SUBTYPES = Object.freeze(
  xdrEnumToConstant('PaymentFeeType')
)

export const ASSET_POLICIES = Object.freeze(
  xdrEnumToConstant('AssetPolicy')
)

export const ASSET_PAIR_POLICIES = Object.freeze(
  xdrEnumToConstant('AssetPairPolicy')
)

export const ACCOUNT_TYPES = Object.freeze(
  xdrEnumToConstant('AccountType')
)

export const STATS_OPERATION_TYPES = Object.freeze(
  xdrEnumToConstant('StatsOpType')
)

export const ASSET_POLICIES_VERBOSE = Object.freeze({
  [xdr.AssetPolicy.transferable().value]: 'Transferable',
  [xdr.AssetPolicy.baseAsset().value]: 'Base asset',
  [xdr.AssetPolicy.statsQuoteAsset().value]: 'Stats quote asset',
  [xdr.AssetPolicy.withdrawable().value]: 'Withdrawable',
  [xdr.AssetPolicy.twoStepWithdrawal().value]: 'Two step withdrawal',
  [xdr.AssetPolicy.requiresKyc().value]: 'Requires Kyc',
  [xdr.AssetPolicy.issuanceManualReviewRequired().value]: 'Issuance manual review required'
})
