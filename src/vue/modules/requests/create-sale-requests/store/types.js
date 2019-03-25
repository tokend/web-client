const mutations = {
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_REQUESTS: 'SET_REQUESTS',
  CONCAT_REQUESTS: 'CONCAT_REQUESTS',
  SET_BALANCES_ASSETS: 'SET_BALANCES_ASSETS',
}

const actions = {
  LOAD_REQUESTS: 'LOAD_REQUESTS',
  LOAD_ACCOUNT_BALANCES: 'LOAD_ACCOUNT_BALANCES',
  CANCEL_REQUEST: 'CANCEL_REQUEST',
}

const getters = {
  accountId: 'accountId',
  accountOwnedAssets: 'accountOwnedAssets',
  requests: 'requests',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
