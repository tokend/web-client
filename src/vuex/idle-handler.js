import config from '@/config'
import { vuexTypes } from './types'

const state = {
  logoutTimer: null,
}

const mutations = {
  [vuexTypes.KEEP_SESSION] () {},

  [vuexTypes.STOP_IDLE] (state) {
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
  [vuexTypes.START_IDLE] ({ dispatch, commit, state }) {
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

export default {
  state,
  actions,
  mutations,
}
