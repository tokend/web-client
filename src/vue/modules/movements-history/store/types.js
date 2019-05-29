const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_MOVEMENTS: 'SET_MOVEMENTS',
  CONCAT_MOVEMENTS: 'CONCAT_MOVEMENTS',
}

const actions = {
  LOAD_MOVEMENTS: 'LOAD_MOVEMENTS',
  LOAD_BALANCES: 'LOAD_BALANCES',
}

const getters = {
  balances: 'balances',
  movements: 'movements',
  getBalanceByAssetCode: 'getBalanceByAssetCode',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
