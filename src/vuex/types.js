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
  SET_KV_ASSET_TYPE_SECURITY: 'SET_KV_ASSET_TYPE_SECURITY',
  SET_KV_POLL_TYPE_RESTRICTED: 'SET_KV_POLL_TYPE_RESTRICTED',
  SET_KV_POLL_TYPE_UNRESTRICTED: 'SET_KV_POLL_TYPE_UNRESTRICTED',

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
  SET_KYC_LATEST_REQUEST_DATA: 'SET_KYC_LATEST_REQUEST_DATA',

  // assets
  SET_ASSETS: 'SET_ASSETS',
  UPDATE_ASSETS: 'UPDATE_ASSETS',
}

const actions = {
  // key-value
  LOAD_KV_ENTRIES: 'LOAD_KV_ENTRIES',
  LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS: 'LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS',

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
  LOAD_KYC_LATEST_REQUEST_DATA: 'LOAD_KYC_LATEST_REQUEST_DATA',
  LOAD_KYC_RELATED_REQUEST: 'LOAD_KYC_RELATED_REQUEST',
  LOAD_KYC_LATEST_DATA: 'LOAD_KYC_LATEST_DATA',

  // assets
  LOAD_ASSETS: 'LOAD_ASSETS',
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
  kvAssetTypeSecurity: 'kvAssetTypeSecurity',
  kvPollTypeRestricted: 'kvPollTypeRestricted',
  kvPollTypeUnrestricted: 'kvPollTypeUnrestricted',
  defaultQuoteAsset: 'defaultQuoteAsset',

  // account
  account: 'account',
  accountId: 'accountId',
  accountBalances: 'accountBalances',
  accountOwnedAssetsBalances: 'accountOwnedAssetsBalances',
  accountBalanceByCode: 'accountBalanceByCode',
  accountRoleId: 'accountRoleId',
  accountDepositAddresses: 'accountDepositAddresses',

  isAccountGeneral: 'isAccountGeneral',
  isAccountCorporate: 'isAccountCorporate',
  isAccountUsAccredited: 'isAccountUsAccredited',
  isAccountUsVerified: 'isAccountUsVerified',
  isAccountUnverified: 'isAccountUnverified',
  isAccountBlocked: 'isAccountBlocked',

  // wallet
  walletId: 'walletId',
  walletAccountId: 'walletAccountId',
  walletEmail: 'walletEmail',
  walletSeed: 'walletSeed',

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
  kycRequestRejectReason: 'kycRequestRejectReason',
  kycRequestResetReason: 'kycRequestResetReason',
  kycRequestExternalDetails: 'kycRequestExternalDetails',
  kycRequestBlockReason: 'kycRequestBlockReason',
  kycAccountRoleToSet: 'kycAccountRoleToSet',
  kycPreviousRequestAccountRoleToSet: 'kycPreviousRequestAccountRoleToSet',
  kycLatestData: 'kycLatestData',
  kycLatestRequestBlobId: 'kycLatestRequestBlobId',
  kycLatestRequestData: 'kycLatestRequestData',
  kycAvatarKey: 'kycAvatarKey',
  isAccountRoleReseted: 'isAccountRoleReseted',

  // assets
  assets: 'assets',
  assetByCode: 'assetByCode',
  balancesAssets: 'balancesAssets',
  fiatAssets: 'fiatAssets',
  depositableAssets: 'depositableAssets',
  coinpaymentsAssets: 'coinpaymentsAssets',
  transferableBalancesAssets: 'transferableBalancesAssets',
  withdrawableBalancesAssets: 'withdrawableBalancesAssets',
  statsQuoteAsset: 'statsQuoteAsset',
  ownedAssets: 'ownedAssets',
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters,
}
