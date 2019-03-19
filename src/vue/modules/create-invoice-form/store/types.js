const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_ASSET_PAIRS: 'SET_ASSET_PAIRS',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
  LOAD_ASSET_PAIRS: 'LOAD_ASSET_PAIRS',
}

const getters = {
  accountId: 'accountId',
  balances: 'balances',
  assetPairs: 'assetPairs',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
