const mutations = {
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_ACCOUNT_BALANCES: 'SET_ACCOUNT_BALANCES',
  SET_ASSETS: 'SET_ASSETS',
  CONCAT_ASSETS: 'CONCAT_ASSETS',
}

const actions = {
  CREATE_BALANCE: 'CREATE_BALANCE',
  LOAD_ACCOUNT_BALANCES: 'LOAD_ACCOUNT_BALANCES',
  LOAD_ASSETS: 'LOAD_ASSETS',
}

const getters = {
  accountId: 'accountId',
  assets: 'assets',
}

export const types = {
  ...actions,
  ...mutations,
  ...getters,
}
