const mutations = {
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_SALE_CREATION_REQUESTS: 'SET_SALE_CREATION_REQUESTS',
  CONCAT_SALE_CREATION_REQUESTS: 'CONCAT_SALE_CREATION_REQUESTS',
  SET_BALANCES_ASSETS: 'SET_BALANCES_ASSETS',
}

const actions = {
  LOAD_SALE_CREATION_REQUESTS: 'LOAD_SALE_CREATION_REQUESTS',
  LOAD_ACCOUNT_BALANCES: 'LOAD_ACCOUNT_BALANCES',
  CANCEL_SALE_CREATION_REQUEST: 'CANCEL_SALE_CREATION_REQUEST',
}

const getters = {
  accountId: 'accountId',
  accountOwnedAssets: 'accountOwnedAssets',
  saleCreationRequests: 'saleCreationRequests',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
