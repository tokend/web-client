const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_ASSETS: 'SET_ASSETS',
  SET_ACCOUNT_BALANCES_DETAILS: 'SET_ACCOUNT_BALANCES_DETAILS',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
  LOAD_ASSETS: 'LOAD_ASSETS',
  LOAD_SALE_BY_BASE_ASSET: 'LOAD_SALE_BY_BASE_ASSET',
  CREATE_OFFER: 'CREATE_OFFER',
  LOAD_ACCOUNT_BALANCES_DETAILS: 'LOAD_ACCOUNT_BALANCES_DETAILS',
}

const getters = {
  accountId: 'accountId',
  balances: 'balances',
  assets: 'assets',
  assetsInBalance: 'assetsInBalance',
  selectedAssetBalance: 'selectedAssetBalance',
  assetDetails: 'assetDetails',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
