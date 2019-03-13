const mutations = {
  SET_SIGNERS: 'SET_SIGNERS',
  CONCAT_SIGNERS: 'CONCAT_SIGNERS',
}

const actions = {
  LOAD_SIGNERS: 'LOAD_SIGNERS',
}

const getters = {
  signers: 'signers',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
