const mutations = {
  SET_ACCOUNT_FEES: 'SET_ACCOUNT_FEES',
}

const actions = {
  LOAD_ACCOUNT_FEES: 'LOAD_ACCOUNT_FEES',
}

const getters = {
  fees: 'fees',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
