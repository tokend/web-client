const mutations = {
  SET_REQUESTS: 'SET_REQUESTS',
  CONCAT_REQUESTS: 'CONCAT_REQUESTS',
  SET_RESTRICTED_POLL_TYPE: 'SET_RESTRICTED_POLL_TYPE'
}

const actions = {
  LOAD_REQUESTS: 'LOAD_REQUESTS',
  CANCEL_REQUEST: 'CANCEL_REQUEST',
  LOAD_RESTRICTED_POLL_TYPE: 'LOAD_RESTRICTED_POLL_TYPE',
}

const getters = {
  requests: 'requests',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
