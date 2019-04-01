const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_ASSETS: 'SET_ASSETS',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
  LOAD_ASSETS: 'LOAD_ASSETS',
}

const getters = {
  accountId: 'accountId',
  balances: 'balances',
  assets: 'assets',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
