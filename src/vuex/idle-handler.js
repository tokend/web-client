import config from '@/config'

const state = {
  logoutTimer: null,
  timestamp: null,
}

const mutations = {
  'KEEP_SESSION': (state) => {},

  'STOP_IDLE': (state) => {
    clearTimeout(state.logoutTimer)
    state.logoutTimer = null

    document.onload = null
    document.onmousemove = null
    document.onmousedown = null
    document.ontouchstart = null
    document.onclick = null
    document.onscroll = null
    document.onkeypress = null
  },
}

const actions = {
  'START_IDLE' ({ dispatch, commit, state }) {
    function resetTimer () {
      clearTimeout(state.logoutTimer)

      state.logoutTimer = setTimeout(() => { dispatch('SHOW_IDLE_FORM') }, config.IDLE_TIMEOUT)
    }

    resetTimer()

    document.onload = resetTimer
    document.onmousemove = resetTimer
    document.onmousedown = resetTimer
    document.ontouchstart = resetTimer
    document.onclick = resetTimer
    document.onscroll = resetTimer
    document.onkeypress = resetTimer
  },
}

const getters = {
  logoutTimer: state => state.logoutTimer,
}

export default {
  state,
  getters,
  actions,
  mutations,
}
