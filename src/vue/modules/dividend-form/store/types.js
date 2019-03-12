const mutations = {
  SET_BALANCES: 'SET_BALANCES',
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_ASSETS: 'SET_ASSETS',
  SET_BALANCE_HOLDERS: 'SET_BALANCE_HOLDERS',
}

const actions = {
  LOAD_BALANCES: 'LOAD_BALANCES',
  LOAD_ASSETS: 'LOAD_ASSETS',
  LOAD_BALANCE_HOLDERS: 'LOAD_BALANCE_HOLDERS',
  LOAD_ACCOUNT_ID: 'LOAD_ACCOUNT_ID',
  LOAD_FEES: 'LOAD_FEES',
}

const getters = {
  accountId: 'accountId',
  balances: 'balances',
  assets: 'assets',
  ownedAssets: 'ownedAssets',
  balanceHolders: 'balanceHolders',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
