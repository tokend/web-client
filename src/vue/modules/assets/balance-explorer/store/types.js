const mutations = {
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_ACCOUNT_BALANCES: 'SET_ACCOUNT_BALANCES',
  SET_ASSETS: 'SET_ASSETS',
}

const actions = {
  LOAD_ACCOUNT_BALANCES: 'LOAD_ACCOUNT_BALANCES',
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
