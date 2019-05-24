const mutations = {
  SET_BALANCES: 'SET_BALANCES',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
}

const getters = {
  balances: 'balances',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
