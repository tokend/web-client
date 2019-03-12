const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
}

const getters = {
  accountId: 'accountId',
  balances: 'balances',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
