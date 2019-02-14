const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_MOVEMENTS: 'SET_MOVEMENTS',
  CONCAT_MOVEMENTS: 'CONCAT_MOVEMENTS',
}

const actions = {
  LOAD_MOVEMENTS: 'LOAD_MOVEMENTS',
  LOAD_BALANCES: 'LOAD_BALANCES',
}

const getters = {
  accountId: 'accountId',
  movements: 'movements',
  getBalanceByAssetCode: 'getBalanceByAssetCode',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
