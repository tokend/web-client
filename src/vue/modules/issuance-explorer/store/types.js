const mutations = {
  SET_ISSUANCES: 'SET_ISSUANCES',
  CONCAT_ISSUANCES: 'CONCAT_ISSUANCES',
}

const actions = {
  LOAD_ISSUANCES: 'LOAD_ISSUANCES',
}

const getters = {
  issuances: 'issuances',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
