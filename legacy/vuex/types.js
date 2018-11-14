const mutations = {
  // root:
  SET_LOGGED_OUT_STATE: 'SET_LOGGED_OUT_STATE',
  KEEP_SESSION: 'KEEP_SESSION',

  // wallet:
  SET_WALLET_ID: 'SET_WALLET_ID',

  // user:
  SET_USER_EMAIL: 'SET_USER_EMAIL',
  SET_USER_CREATED_AT: 'SET_USER_CREATED_AT',

  // account:
  SET_ACCOUNT_KEYS: 'SET_ACCOUNT_KEYS',
  SET_ACCOUNT_BALANCES: 'SET_ACCOUNT_BALANCES',
  SET_ACCOUNT_DETAILS: 'SET_ACCOUNT_DETAILS',
  SET_ACCOUNT_LIMITS: 'SET_ACCOUNT_LIMITS',

  // account.kyc:
  SET_ACCOUNT_KYC_REQUESTS: 'SET_ACCOUNT_KYC_REQUESTS',
  SET_ACCOUNT_KYC_DATA: 'SET_ACCOUNT_KYC_DATA',
  SET_ACCOUNT_KYC_TYPE: 'SET_ACCOUNT_KYC_TYPE',
  SET_ACCOUNT_KYC_DOCUMENTS: 'SET_ACCOUNT_KYC_DOCUMENTS',

  // transactions:
  SET_TX_LIST_INITIALIZED: 'SET_TX_LIST_INITIALIZED',
  UPDATE_TX_LIST: 'UPDATE_TX_LIST',
  UPDATE_TX_LIST_ITEM: 'UPDATE_TX_LIST_ITEM',

  // pairs:
  SET_ASSET_PAIRS: 'SET_ASSET_PAIRS',

  // trades:
  SET_SELL_OFFERS: 'SET_SELL_OFFERS',
  SET_BUY_OFFERS: 'SET_BUY_OFFERS',

  // tokens:
  SET_ALL_TOKENS: 'SET_ALL_TOKENS',

  // sales:
  SET_SALES: 'SET_SALES',
  UPDATE_SALE_REQUEST_LIST: 'UPDATE_SALE_REQUEST_LIST',
  UPDATE_SALE_REQUEST_LIST_ITEM: 'UPDATE_SALE_REQUEST_LIST_ITEM',
  SET_SALE_REQUEST_LIST_INITIALIZED: 'SET_SALE_REQUEST_LIST_INITIALIZED'
}

const actions = {
  LOG_IN: 'LOG_IN',
  LOG_OUT: 'LOG_OUT',

  // wallet:
  PROCESS_USER_WALLET: 'PROCESS_USER_WALLET',
  STORE_USER_DATA_FROM_WALLET: 'STORE_USER_DATA_FROM_WALLET',

  // user:
  GET_USER_DETAILS: 'GET_USER_DETAILS',
  GET_USER_FAVORITES: 'GET_USER_FAVORITES',

  // account:
  GET_ACCOUNT_DETAILS: 'GET_ACCOUNT_DETAILS',
  GET_ACCOUNT_BALANCES: 'GET_ACCOUNT_BALANCES',
  GET_ACCOUNT_LIMITS: 'GET_ACCOUNT_LIMITS',
  // account.kyc:
  GET_ACCOUNT_KYC_DATA: 'GET_ACCOUNT_KYC_DATA',
  GET_ACCOUNT_KYC_REQUESTS: 'GET_ACCOUNT_KYC_REQUESTS',
  UPDATE_ACCOUNT_KYC_DATA: 'UPDATE_ACCOUNT_KYC_DATA',
  UPDATE_ACCOUNT_KYC_DOCUMENTS: 'UPDATE_ACCOUNT_KYC_DOCUMENTS',

  // transactions:
  INIT_TX_LIST: 'INIT_TX_LIST',
  GET_TX_LIST: 'GET_TX_LIST',
  NEXT_TX_LIST: 'NEXT_TX_LIST',
  UPDATE_TX_COUNTERPARTIES: 'UPDATE_TX_COUNTERPARTIES',

  // pairs:
  GET_ASSET_PAIRS: 'GET_ASSET_PAIRS',

  // trades:
  GET_TRADES: 'GET_TRADES',
  GET_SM_OFFERS: 'GET_SM_OFFERS',
  GET_BUY_OFFERS: 'GET_BUY_OFFERS',
  GET_SELL_OFFERS: 'GET_SELL_OFFERS',
  GET_USER_OFFERS: 'GET_USER_OFFERS',

  // tokens:
  GET_ALL_TOKENS: 'GET_ALL_TOKENS',

  // sales:
  GET_SALES: 'GET_SALES',

  // requests:
  GET_USER_TOKENS_CREATION_REQUESTS: 'GET_USER_TOKENS_CREATION_REQUESTS',
  NEXT_USER_TOKENS_CREATION_REQUESTS: 'NEXT_USER_TOKENS_CREATION_REQUESTS',
  GET_USER_WITHDRAWAL_REQUESTS: 'GET_USER_WITHDRAWAL_REQUESTS',
  NEXT_USER_WITHDRAWAL_REQUESTS: 'NEXT_USER_WITHDRAWAL_REQUESTS',
  GET_USER_PREISSUANCE_UPLOAD_REQUESTS: 'GET_USER_PREISSUANCE_UPLOAD_REQUESTS',
  NEXT_USER_PREISSUANCE_UPLOAD_REQUESTS: 'NEXT_USER_PREISSUANCE_UPLOAD_REQUESTS',
  GET_USER_SALE_CREATION_REQUESTS: 'GET_USER_SALE_CREATION_REQUESTS',
  NEXT_USER_SALE_CREATION_REQUESTS: 'NEXT_USER_SALE_CREATION_REQUESTS',
  INIT_SALE_REQUESTS_LIST: 'INIT_SALE_REQUESTS_LIST',
  GET_LIMITS_REQUESTS: 'GET_LIMITS_REQUESTS',
  NEXT_LIMITS_REQUESTS: 'NEXT_LIMITS_REQUESTS'
}

const getters = {
  isLoggedIn: 'isLoggedIn',

  // user:
  userEmail: 'userEmail',
  userType: 'userType',
  userCreatedAt: 'userCreatedAt',
  userFavorites: 'userFavorites',

  // wallet:
  walletId: 'walletId',

  // account:
  // TODO: need 'userAccountId' and 'keypair' for backwards compatibility only
  userAccountId: 'accountId',
  keypair: 'accountKeypair',
  account: 'account',
  accountId: 'accountId',
  accountType: 'accountType',
  accountTypeI: 'accountTypeI',
  accountBlocked: 'accountBlocked',
  accountLimits: 'accountLimits',
  accountSeed: 'accountSeed',
  accountPublicKey: 'accountPublicKey',
  accountKeypair: 'accountKeypair',
  accountCreatedAt: 'accountCreatedAt',
  accountTokens: 'accountTokens',
  accountBalances: 'accountBalances',
  accountOwnedTokens: 'accountOwnedTokens',
  accountOwnedTokenCodes: 'accountOwnedTokenCodes',
  accountRawBalances: 'accountRawBalances',
  accountDepositAddresses: 'accountDepositAddresses',
  // account.kyc:
  accountState: 'accountState',
  accountKycRejectReason: 'accountKycRejectReason',
  accountKycData: 'accountKycData',
  accountKycDocuments: 'accountKycDocuments',
  accountLatestBlobId: 'accountLatestBlobId',
  accountKycLatestRequest: 'accountKycLatestRequest',
  accountLatestKycLevel: 'accountLatestKycLevel',

  // tokens:
  tokens: 'tokens',
  walletTokens: 'walletTokens',
  userOwnedTokens: 'userOwnedTokens',
  userAcquiredTokens: 'userAcquiredTokens',
  userWalletTokens: 'userWalletTokens',
  userTransferableTokens: 'userTransferableTokens',
  userWithdrawableTokens: 'userWithdrawableTokens',
  userKycDetails: 'userKycDetails',
  userKycDocuments: 'userKycDocuments',

  // transactions:
  transactions: 'transactions',

  // pairs:
  assetPairs: 'assetPairs',
  tradablePairs: 'tradablePairs',

  // trades:
  trades: 'trades',
  buyOffers: 'buyOffers',
  sellOffers: 'sellOffers',
  userOffers: 'userOffers',

  // requests:
  tokenCreationRequests: 'tokenCreationRequests',
  withdrawalRequests: 'withdrawalRequests',
  saleCreationRequests: 'saleCreationRequests',
  preIssuanceUploadRequests: 'preIssuanceUploadRequests',
  limitsRequests: 'limitsRequests',
  isLimitsRequestsLoaded: 'isLimitsRequestsLoaded',

  // sales:
  sales: 'sales',
  salesOwned: 'salesOwned',
  starredSales: 'starredSales',
  saleIds: 'saleIds',

  // offers:
  saleOffers: 'saleOffers'
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters
}
