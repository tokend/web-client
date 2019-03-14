import { types } from './types'
import { api } from '../_api'
import { Signer } from '../wrappers/signer'

const state = {
  signers: [],
}

const mutations = {
  [types.SET_SIGNERS] (state, signers) {
    state.signers = signers
  },
  [types.CONCAT_SIGNERS] (state, signers) {
    state.signers = state.signers.concat(signers)
  },
}

const actions = {
  [types.LOAD_SIGNERS] (_, attachedAccountId) {
    const endpoint = `/v3/accounts/${attachedAccountId}/signers`
    return api().getWithSignature(endpoint, {
      include: ['role.rules'],
    })
  },
}

const getters = {
  [types.signers]: state => state.signers.map(s => new Signer(s)),
}

export const documentSignersManager = {
  name: 'document-signers-manager',
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
}
