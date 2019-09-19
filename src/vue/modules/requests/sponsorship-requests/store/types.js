const mutations = {
  SET_REQUESTS: 'SET_REQUESTS',
  CONCAT_REQUESTS: 'CONCAT_REQUESTS',
}

const actions = {
  LOAD_REQUESTS: 'LOAD_REQUESTS',
  APPROVE_OR_REJECT_REQUEST: 'APPROVE_OR_REJECT_REQUEST',
}

const getters = {
  requests: 'requests',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
