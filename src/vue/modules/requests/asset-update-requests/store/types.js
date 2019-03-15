const mutations = {
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_ASSET_UPDATE_REQUESTS: 'SET_ASSET_UPDATE_REQUESTS',
  CONCAT_ASSET_UPDATE_REQUESTS: 'CONCAT_ASSET_UPDATE_REQUESTS',
}

const actions = {
  LOAD_ASSET_UPDATE_REQUESTS: 'LOAD_ASSET_UPDATE_REQUESTS',
  CANCEL_ASSET_UPDATE_REQUEST: 'CANCEL_ASSET_UPDATE_REQUEST',
}

const getters = {
  accountId: 'accountId',
  assetUpdateRequests: 'assetUpdateRequests',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
