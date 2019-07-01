import { vuexTypes } from './types'
import { api } from '@/api'
import { encryptSecretSeed, decryptSecretSeed } from '@tokend/js-sdk'

export const state = {
  sessionId: '',
  encryptSecretSeed: '',
}

export const mutations = {
  [vuexTypes.SET_SESSION] (state, session) {
    state.sessionId = session.sessionId
    const encryptWalletSeed = encryptSecretSeed(
      session.secretSeed,
      session.sessionKey
    )
    state.encryptSecretSeed = encryptWalletSeed
  },
}

export const actions = {
  async [vuexTypes.DECRYPT_SECRET_SEED] ({ commit, getters, dispatch }) {
    const encryptSecretSeed = getters[vuexTypes.encryptWalletSeed]
    const session = await dispatch(vuexTypes.UPDATE_SESSION)
    const secretSeed = decryptSecretSeed(
      encryptSecretSeed,
      session.encryptionKey
    )
    return secretSeed
  },

  async [vuexTypes.UPDATE_SESSION] ({ commit, getters }) {
    const sessionId = getters[vuexTypes.sessionId]
    const { data } = await api.get(`/sessions/${sessionId}`)
    return data
  },
}

export const getters = {
  [vuexTypes.sessionId]: state => state.sessionId,
  [vuexTypes.encryptWalletSeed]: (state, getters) => state.encryptSecretSeed,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
