const mutations = {
  // root
  CLEAR_STATE: 'CLEAR_STATE',
  POP_STATE: 'POP_STATE',

  // key-value
  SET_KV_ENTRY_GENERAL_ROLE_ID: 'SET_KV_ENTRY_GENERAL_ROLE_ID',
  SET_KV_ENTRY_CORPORATE_ROLE_ID: 'SET_KV_ENTRY_CORPORATE_ROLE_ID',
  SET_KV_ENTRY_UNVERIFIED_ROLE_ID: 'SET_KV_ENTRY_UNVERIFIED_ROLE_ID',
  SET_KV_ENTRY_BLOCKED_ROLE_ID: 'SET_KV_ENTRY_BLOCKED_ROLE_ID',
  SET_KV_ENTRY_US_VERIFIED_ROLE_ID: 'SET_KV_ENTRY_US_VERIFIED_ROLE_ID',
  SET_KV_ENTRY_US_ACCREDITED_ROLE_ID: 'SET_KV_ENTRY_US_ACCREDITED_ROLE_ID',

  SET_KV_KYC_REQUIRED: 'SET_KV_KYC_REQUIRED',
  SET_DEFAULT_QUOTE_ASSET: 'SET_DEFAULT_QUOTE_ASSET',

  // account
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_ACCOUNT_BALANCES_DETAILS: 'SET_ACCOUNT_BALANCES_DETAILS',

  // wallet
  SET_WALLET: 'SET_WALLET',

  // factors
  SET_FACTORS: 'SET_FACTORS',

  // kyc
  SET_KYC_LATEST_REQUEST: 'SET_KYC_LATEST_REQUEST',
  SET_KYC_RELATED_REQUEST: 'SET_KYC_RELATED_REQUEST',
  SET_KYC_LATEST_DATA: 'SET_KYC_LATEST_DATA',
  SET_ACCOUNT_ROLE_RESETED: 'SET_ACCOUNT_ROLE_RESETED',
}

const actions = {
  // key-value
  LOAD_KV_ENTRIES: 'LOAD_KV_ENTRIES',
  LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS: 'LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS',
  LOAD_KV_KYC_REQUIRED: 'LOAD_KV_KYC_REQUIRED',
  LOAD_DEFAULT_QUOTE_ASSET: 'LOAD_DEFAULT_QUOTE_ASSET',

  // account
  LOAD_ACCOUNT: 'LOAD_ACCOUNT',
  LOAD_ACCOUNT_BALANCES_DETAILS: 'LOAD_ACCOUNT_BALANCES_DETAILS',

  // wallet
  LOAD_WALLET: 'LOAD_WALLET',
  STORE_WALLET: 'STORE_WALLET',

  // factors
  LOAD_FACTORS: 'LOAD_FACTORS',

  // kyc
  LOAD_KYC: 'LOAD_KYC',
  LOAD_KYC_LATEST_REQUEST: 'LOAD_KYC_LATEST_REQUEST',
  LOAD_KYC_RELATED_REQUEST: 'LOAD_KYC_RELATED_REQUEST',
  LOAD_KYC_DATA: 'LOAD_KYC_DATA',
}

const getters = {
  // root
  isLoggedIn: 'isLoggedIn',

  // key-values
  kvEntryGeneralRoleId: 'kvEntryGeneralRoleId',
  kvEntryCorporateRoleId: 'kvEntryCorporateRoleId',
  kvEntryUnverifiedRoleId: 'kvEntryUnverifiedRoleId',
  kvEntryBlockedRoleId: 'kvEntryBlockedRoleId',
  kvEntryUsVerifiedRoleId: 'kvEntryUsVerifiedRoleId',
  kvEntryUsAccreditedRoleId: 'kvEntryUsAccreditedRoleId',
  kvAssetTypeKycRequired: 'kvAssetTypeKycRequired',
  defaultQuoteAsset: 'defaultQuoteAsset',

  // account
  account: 'account',
  accountId: 'accountId',
  accountBalances: 'accountBalances',
  accountRoleId: 'accountRoleId',
  accountDepositAddresses: 'accountDepositAddresses',

  isAccountGeneral: 'isAccountGeneral',
  isAccountCorporate: 'isAccountCorporate',
  isAccountUsAccredited: 'isAccountUsAccredited',
  isAccountUsVerified: 'isAccountUsVerified',
  isAccountUnverified: 'isAccountUnverified',
  isAccountBlocked: 'isAccountBlocked',

  // wallet
  wallet: 'wallet',
  walletId: 'walletId',
  walletEmail: 'walletEmail',
  walletSeed: 'walletSeed',
  walletKeypair: 'walletKeypair',
  walletPublicKey: 'walletPublicKey',

  // factors
  factors: 'factors',
  factorsTotp: 'factorsTotp',
  factorsPassword: 'factorsPassword',
  factorsEmail: 'factorsEmail',
  factorsTotpEnabled: 'factorsTotpEnabled',
  isTotpEnabled: 'isTotpEnabled',

  // kyc
  kycState: 'kycState',
  kycStateI: 'kycStateI',
  kycRequestId: 'kycRequestId',
  kycLatestBlobId: 'kycLatestBlobId',
  kycRequestRejectReason: 'kycRequestRejectReason',
  kycRequestResetReason: 'kycRequestResetReason',
  kycRequestBlockReason: 'kycRequestBlockReason',
  kycAccountRoleToSet: 'kycAccountRoleToSet',
  kycPreviousRequestAccountRoleToSet: 'kycPreviousRequestAccountRoleToSet',
  kycLatestData: 'kycLatestData',
  kycAvatarKey: 'kycAvatarKey',
  isAccountRoleReseted: 'isAccountRoleReseted',
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters,
}
