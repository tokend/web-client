import config from '@/config'
import { vuexTypes } from './types'
import moment from 'moment'
import throttle from 'lodash/throttle'

const IDLE_TICKER_INTERVAL = 1000
const THROTTLE_DELAY = 3000

const state = {
  logoutAt: null,
}

const mutations = {
  [vuexTypes.UPDATE_LOGOUT_AT] (state) {
    state.logoutAt = moment().add(config.IDLE_TIMEOUT, 'minutes')
  },
}

const actions = {
  [vuexTypes.START_IDLE] ({ dispatch, commit, rootGetters }) {
    if (rootGetters[vuexTypes.isLoggedIn]) {
      commit(vuexTypes.UPDATE_LOGOUT_AT)
    }
    dispatch(vuexTypes.KEEP_SESSION)
    dispatch(vuexTypes.INIT_IDLE_TICKER)

    function resetTimer () {
      if (rootGetters[vuexTypes.isLoggedIn]) {
        commit(vuexTypes.UPDATE_LOGOUT_AT)
      }
    }

    document.onload = throttle(resetTimer, THROTTLE_DELAY)
    document.onmousemove = throttle(resetTimer, THROTTLE_DELAY)
    document.onmousedown = throttle(resetTimer, THROTTLE_DELAY)
    document.ontouchstart = throttle(resetTimer, THROTTLE_DELAY)
    document.onclick = throttle(resetTimer, THROTTLE_DELAY)
    document.onscroll = throttle(resetTimer, THROTTLE_DELAY)
    document.onkeypress = throttle(resetTimer, THROTTLE_DELAY)
  },

  [vuexTypes.KEEP_SESSION] ({ dispatch, rootGetters }) {
    setInterval(() => {
      if (rootGetters[vuexTypes.isLoggedIn]) {
        dispatch(vuexTypes.PROLONGATE_SESSION)
      }
    }, config.KEEP_SESSION_INTERVAL)
  },

  [vuexTypes.INIT_IDLE_TICKER] ({ dispatch, state, rootGetters }) {
    setInterval(() => {
      if (rootGetters[vuexTypes.isLoggedIn] &&
        moment().isSameOrAfter(state.logoutAt)) {
        dispatch(vuexTypes.LOGOUT_IDLE)
      }
    }, IDLE_TICKER_INTERVAL)
  },

  [vuexTypes.LOGOUT_IDLE] ({ commit }) {
    commit(vuexTypes.CLEAR_STATE)
    location.href = location.href + '&isIdle=true'
  },

  [vuexTypes.LOGOUT_SESSION] ({ commit }) {
    commit(vuexTypes.CLEAR_STATE)
    location.href = location.href + '?isSessionExpired=true'
  },

}

export default {
  state,
  actions,
  mutations,
}
