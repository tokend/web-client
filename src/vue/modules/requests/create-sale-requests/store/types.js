const mutations = {
  SET_REQUESTS: 'SET_REQUESTS',
  CONCAT_REQUESTS: 'CONCAT_REQUESTS',
}

const actions = {
  LOAD_ASSET_BY_ID: 'LOAD_ASSET_BY_ID',
  LOAD_REQUESTS: 'LOAD_REQUESTS',
  CANCEL_REQUEST: 'CANCEL_REQUEST',
}

const getters = {
  requests: 'requests',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
