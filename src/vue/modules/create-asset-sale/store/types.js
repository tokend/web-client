const mutations = {
  SET_BALANCES: 'SET_BALANCES',
}

const actions = {
  LOAD_KV_KYC_REQUIRED: 'LOAD_KV_KYC_REQUIRED',
  LOAD_BLOB_ID: 'LOAD_BLOB_ID',
  LOAD_ASSETS: 'LOAD_ASSETS',
}

const getters = {
  accountId: 'accountId',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
