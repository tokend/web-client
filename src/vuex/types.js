const mutations = {
  // root
  CLEAR_STATE: 'CLEAR_STATE',
  POP_STATE: 'POP_STATE',

  // key-value
  SET_KV_ENTRY_GENERAL_ROLE_ID: 'SET_KV_ENTRY_GENERAL_ROLE_ID',
  SET_KV_ENTRY_CORPORATE_ROLE_ID: 'SET_KV_ENTRY_CORPORATE_ROLE_ID',
  SET_KV_ENTRY_UNVERIFIED_ROLE_ID: 'SET_KV_ENTRY_UNVERIFIED_ROLE_ID',
  SET_KV_ASSET_TYPE: 'SET_KV_ASSET_TYPE',

  // account
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_ACCOUNT_BALANCES_DETAILS: 'SET_ACCOUNT_BALANCES_DETAILS',

  // wallet
  SET_WALLET: 'SET_WALLET',

  // factors
  SET_FACTORS: 'SET_FACTORS',

  // kyc
  SET_KYC_LATEST_REQUEST: 'SET_KYC_LATEST_REQUEST',
  SET_KYC_APPROVED_DATA: 'SET_KYC_APPROVED_DATA',
  SET_KYC_LATEST_DATA: 'SET_KYC_LATEST_DATA',
}

const actions = {
  // key-value
  LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS: 'LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS',
  LOAD_KV_ASSET_TYPE: 'LOAD_KV_ASSET_TYPE',

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
  LOAD_KYC_DATA: 'LOAD_KYC_DATA',
}

const getters = {
  // root
  isLoggedIn: 'isLoggedIn',

  // key-values
  kvEntryGeneralRoleId: 'kvEntryGeneralRoleId',
  kvEntryCorporateRoleId: 'kvEntryCorporateRoleId',
  kvEntryUnverifiedRoleId: 'kvEntryUnverifiedRoleId',
  kvAssetTypeKycRequired: 'kvAssetTypeKycRequired',

  // account
  account: 'account',
  balancesDetails: 'balancesDetails',
  accountId: 'accountId',
  accountIsBlocked: 'accountIsBlocked',
  accountBlockReasons: 'accountBlockReasons',
  accountThresholds: 'accountThresholds',
  accountReferrer: 'accountReferrer',
  accountReferrals: 'accountReferrals',
  accountPoliciesTypeI: 'accountPoliciesTypeI',
  accountPoliciesTypes: 'accountPoliciesTypes',
  accountBalances: 'accountBalances',
  accountDepositAddresses: 'accountDepositAddresses',
  accountKycBlobId: 'accountKycBlobId',
  accountRoleId: 'accountRoleId',

  isAccountGeneral: 'isAccountGeneral',
  isAccountCorporate: 'isAccountCorporate',
  isAccountUnverified: 'isAccountUnverified',

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
  kycRequestRejectReason: 'kycRequestRejectReason',
  kycAccountRoleToSet: 'kycAccountRoleToSet',
  kycLatestData: 'kycLatestData',
  kycApprovedData: 'kycApprovedData',
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters,
}
