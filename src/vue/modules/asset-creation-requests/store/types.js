const mutations = {
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_ASSET_CREATION_REQUESTS: 'SET_ASSET_CREATION_REQUESTS',
  CONCAT_ASSET_CREATION_REQUESTS: 'CONCAT_ASSET_CREATION_REQUESTS',
}

const actions = {
  LOAD_ASSET_CREATION_REQUESTS: 'LOAD_ASSET_CREATION_REQUESTS',
}

const getters = {
  accountId: 'accountId',
  assetCreationRequests: 'assetCreationRequests',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
