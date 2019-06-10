const mutations = {
  SET_MOVEMENTS: 'SET_MOVEMENTS',
  CONCAT_MOVEMENTS: 'CONCAT_MOVEMENTS',
}

const actions = {
  LOAD_MOVEMENTS: 'LOAD_MOVEMENTS',
  LOAD_SHARE_MOVEMENTS: 'LOAD_SHARE_MOVEMENTS',
}

const getters = {
  movements: 'movements',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
