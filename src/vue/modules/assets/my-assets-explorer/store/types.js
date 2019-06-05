const mutations = {
  SET_ASSETS: 'SET_ASSETS',
  SET_ACCOUNT_BALANCES: 'SET_ACCOUNT_BALANCES',
}

const actions = {
  LOAD_ACCOUNT_OWNED_ASSETS: 'LOAD_ACCOUNT_OWNED_ASSETS',
  LOAD_ACCOUNT_BALANCES: 'LOAD_ACCOUNT_BALANCES',
}

const getters = {
  assets: 'assets',
  balances: 'balances',
}

export const types = {
  ...actions,
  ...mutations,
  ...getters,
}
