import config from '@/config'
import { vuexTypes } from './types'
import moment from 'moment'
import throttle from 'lodash/throttle'

const IDLE_TICKER_INTERVAL = 1000
const DEBOUNCE_DELAY = 3000

function getQueryParameters (queryParametr) {
  // location.search return the querystring part of a URL
  return location.search ? '&' + queryParametr : '?' + queryParametr
}

const state = {
  logoutAt: '',
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

    document.onload = throttle(resetTimer, DEBOUNCE_DELAY)
    document.onmousemove = throttle(resetTimer, DEBOUNCE_DELAY)
    document.onmousedown = throttle(resetTimer, DEBOUNCE_DELAY)
    document.ontouchstart = throttle(resetTimer, DEBOUNCE_DELAY)
    document.onclick = throttle(resetTimer, DEBOUNCE_DELAY)
    document.onscroll = throttle(resetTimer, DEBOUNCE_DELAY)
    document.onkeypress = throttle(resetTimer, DEBOUNCE_DELAY)
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
    location.href = location.href + getQueryParameters('isIdle=true')
  },

  [vuexTypes.LOGOUT_SESSION] ({ commit }) {
    commit(vuexTypes.CLEAR_STATE)
    location.href = location.href + getQueryParameters('isSessionExpired=true')
  },

}

export default {
  state,
  actions,
  mutations,
}
