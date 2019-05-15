const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_ASSET_PAIRS: 'SET_ASSET_PAIRS',
  SET_MOVEMENTS: 'SET_MOVEMENTS',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
  LOAD_ASSET_PAIRS: 'LOAD_ASSET_PAIRS',
  LOAD_MOVEMENTS: 'LOAD_MOVEMENTS',
}

const getters = {
  balances: 'balances',
  assetPairs: 'assetPairs',
  movements: 'movements',
  getBalanceByAssetCode: 'getBalanceByAssetCode',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
