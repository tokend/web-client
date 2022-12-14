import config from '@/config'
import { vuexTypes } from './types'
import { DateUtil } from '@/js/utils'
import debounce from 'lodash/debounce'

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
    state.logoutAt = DateUtil.add(undefined, config.IDLE_TIMEOUT, 'minutes')
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

    document.onload = debounce(resetTimer, DEBOUNCE_DELAY)
    document.onmousemove = debounce(resetTimer, DEBOUNCE_DELAY)
    document.onmousedown = debounce(resetTimer, DEBOUNCE_DELAY)
    document.ontouchstart = debounce(resetTimer, DEBOUNCE_DELAY)
    document.onclick = debounce(resetTimer, DEBOUNCE_DELAY)
    document.onscroll = debounce(resetTimer, DEBOUNCE_DELAY)
    document.onkeypress = debounce(resetTimer, DEBOUNCE_DELAY)
  },

  [vuexTypes.KEEP_SESSION] ({ dispatch, rootGetters }) {
    setInterval(() => {
      if (rootGetters[vuexTypes.isLoggedIn]) {
        dispatch(vuexTypes.PROLONGATE_SESSION)
      }
    }, config.KEEP_SESSION_INTERVAL)
  },

  [vuexTypes.INIT_IDLE_TICKER] ({ dispatch, getters, rootGetters }) {
    setInterval(() => {
      const logoutAt = getters[vuexTypes.logoutAt]

      if (rootGetters[vuexTypes.isLoggedIn] &&
        DateUtil.isSameOrAfter(undefined, logoutAt)) {
        dispatch(vuexTypes.LOGOUT_IDLE)
      }
    }, IDLE_TICKER_INTERVAL)
  },

  [vuexTypes.LOGOUT_IDLE] ({ dispatch }) {
    dispatch(vuexTypes.LOG_OUT)
    location.href = location.href + getQueryParameters('isIdle=true')
  },

  [vuexTypes.LOGOUT_SESSION] ({ dispatch }) {
    dispatch(vuexTypes.LOG_OUT)
    location.href = location.href + getQueryParameters('isSessionExpired=true')
  },

}

const getters = {
  [vuexTypes.logoutAt]: state => state.logoutAt,
}

export default {
  state,
  actions,
  mutations,
  getters,
}
