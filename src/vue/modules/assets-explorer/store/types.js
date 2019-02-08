const mutations = {
  SET_ASSETS: 'SET_ASSETS',
  SET_NEXT_ASSETS: 'SET_NEXT_ASSETS',
  SET_BALANCES: 'SET_BALANCES',
  SET_BALANCES_OWNER_ID: 'SET_BALANCES_OWNER_ID',
}

const actions = {
  LOAD_ASSETS: 'LOAD_ASSETS',
  LOAD_BALANCES: 'LOAD_BALANCES',
  CREATE_BALANCE: 'CREATE_BALANCE',
}

const getters = {
  assets: 'assets',
  balances: 'balances',
  balancesOwnerId: 'balancesOwnerId',
}

export const types = {
  ...actions,
  ...mutations,
  ...getters,
}
