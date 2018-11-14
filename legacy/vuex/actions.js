export const LOG_IN = ({ commit, dispatch, getters }) => {
  commit('SET_LOGGED_IN_STATE')
}

export const LOG_OUT = ({ commit }) => {
  commit('SET_LOGGED_OUT_STATE')
  location.reload()
}

export const SET_WALLET_ID = ({ commit }, wallet) => {
  commit('SET_WALLET_ID', wallet)
}
