import { vuexTypes } from './types'
import { api } from '@/api'

export const state = {
  sessionId: '',
  secretSeed: '',
}

export const mutations = {
  [vuexTypes.SET_SESSION] (state, session) {
    state.sessionId = session.sessionId
    state.secretSeed = session.secretSeed
  },
}

export const actions = {
  async [vuexTypes.LOAD_SESSION] ({ commit, getters }) {
    const sessionId = getters[vuexTypes.sessionId]
    const { data } = await api.get(`/sessions/${sessionId}`)
    commit(vuexTypes.SET_SESSION, {
      sessionId: data.id,
      sessionKey: data.encryptionKey,
    })
  },
}

export const getters = {
  [vuexTypes.sessionId]: state => state.sessionId,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
