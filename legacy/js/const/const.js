export const airdropStates = {
  claimed: 'claimed',
  eligible: 'eligible',
  notEligible: 'not_eligible'
}

export const favoriteTypes = {
  sale: 'sale',
  assetPair: 'asset_pair'
}

export { blobTypes, blobFilters, documentTypes, MAX_FILE_MEGABYTES, MAX_FILE_BYTES } from './documents.const'
export { SECONDARY_MARKET_ORDER_BOOK_ID } from './offers.const'
export { walletTokens, brokenTokenCodes } from './tokens.const'
export { feeAsset, withdrawalFeeETH } from './fees.const'
export { saleSortTypes, saleStates } from './sales.const'
export { userStates, userTypes } from './user.const'
export { defaultSignerParams } from './signers.const'
export { localStorageKeys } from './common.const'
export { ROUNDING_MODES } from './numbers.const'
export { CREATE_TOKEN_REQUEST_STATES } from './create_token_request_states'
export { ISSUANCE_REQUEST_STATES } from './issuance_request_states.const'
export { REQUEST_STATES, REQUEST_STATES_STR } from './request_states.const'
export { SIGNER_TYPES } from './signer_types.const'
export { ACCOUNT_STATES } from './account.const'
export { DOCUMENT_POLICIES } from './document-policies.const'
export { LIMIT_OPS, LIMIT_OPS_STR, LIMITS_REQUEST_TYPE, LIMITS_REQUEST_TYPE_STR } from './limits.const'
export { KEY_CODES } from './key_codes.const'

export { PAGES_NAMES } from './pages-names.const'
export { TX_STATES } from './transaction_statuses'
export {
  REQUEST_TYPES,
  FEE_TYPES,
  ASSET_POLICIES,
  ASSET_POLICIES_VERBOSE,
  STATS_OPERATION_TYPES,
  ACCOUNT_TYPES
} from './xdr.const'

export {
  DEFAULT_PRECISION,
  DEFAULT_INPUT_STEP,
  DEFAULT_MAX_AMOUNT
} from './configs.const'
export { assetMap } from './asset_map'
export { ORDER_TYPES } from './order-types'
