const mutations = {
  SET_ASSETS: 'SET_ASSETS',
  CONCAT_ASSETS: 'CONCAT_ASSETS',
  SET_BALANCES: 'SET_BALANCES',
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
}

const actions = {
  LOAD_ASSETS: 'LOAD_ASSETS',
  LOAD_BALANCES: 'LOAD_BALANCES',
  CREATE_BALANCE: 'CREATE_BALANCE',
}

const getters = {
  assets: 'assets',
  accountId: 'accountId',
  getBalanceByAssetCode: 'getBalanceByAssetCode',
}

export const types = {
  ...actions,
  ...mutations,
  ...getters,
}
