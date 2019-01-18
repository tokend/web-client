const mutations = {
  // root
  CLEAR_STATE: 'CLEAR_STATE',
  POP_STATE: 'POP_STATE',

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
  // account
  LOAD_ACCOUNT: 'LOAD_ACCOUNT',
  LOAD_ACCOUNT_BALANCES_DETAILS: 'LOAD_ACCOUNT_BALANCES_DETAILS',
  LOAD_BALANCE_ID_BY_EMAIL: 'LOAD_BALANCE_ID_BY_EMAIL',

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

  // account
  account: 'account',
  accountId: 'accountId',
  accountIsBlocked: 'accountIsBlocked',
  accountBlockReasons: 'accountBlockReasons',
  accountType: 'accountType',
  accountTypeI: 'accountTypeI',
  accountThresholds: 'accountThresholds',
  accountReferrer: 'accountReferrer',
  accountReferrals: 'accountReferrals',
  accountPoliciesTypeI: 'accountPoliciesTypeI',
  accountPoliciesTypes: 'accountPoliciesTypes',
  accountBalances: 'accountBalances',
  accountDepositAddresses: 'accountDepositAddresses',
  accountKycBlobId: 'accountKycBlobId',

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
  kycLatestData: 'kycLatestData',
  kycApprovedData: 'kycApprovedData',
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters,
}
