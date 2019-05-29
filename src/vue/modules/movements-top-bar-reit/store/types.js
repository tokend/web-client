const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_ASSETS: 'SET_ASSETS',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
  LOAD_ASSETS: 'LOAD_ASSETS',
}

const getters = {
  balances: 'balances',
  assets: 'assets',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
