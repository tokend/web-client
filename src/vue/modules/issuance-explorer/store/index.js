import { IssuanceRequest } from '../wrappers/issuance'

import { types } from './types'

import { api } from '@/api'
import { vuexTypes } from '@/vuex'

export const state = {
  issuances: [],
}

export const mutations = {
  [types.SET_ISSUANCES] (state, issuances) {
    state.issuances = issuances
  },
  [types.CONCAT_ISSUANCES] (state, issuances) {
    state.issuances = state.issuances.concat(issuances)
  },
}

export const actions = {
  [types.LOAD_ISSUANCES] ({ rootGetters }) {
    return api.getWithSignature('/v3/create_issuance_requests', {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: rootGetters[vuexTypes.accountId],
      },
      include: ['request_details'],
    })
  },
}

export const getters = {
  [types.issuances]: state => state.issuances.map(i => new IssuanceRequest(i)),
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
