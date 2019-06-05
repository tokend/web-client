const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_SHARES: 'SET_SHARES',
  CONCAT_SHARES: 'CONCAT_SHARES',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
  LOAD_SHARES: 'LOAD_SHARES',
}

const getters = {
  balances: 'balances',
  shares: 'shares',
  getBalanceByAssetCode: 'getBalanceByAssetCode',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
