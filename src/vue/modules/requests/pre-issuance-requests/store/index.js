import { PreIssuanceRequest } from '../wrappers/pre-issuance-request'

import { types } from './types'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'

export const state = {
  requests: [],
}

export const mutations = {
  [types.SET_REQUESTS] (state, requests) {
    state.requests = requests
  },
  [types.CONCAT_REQUESTS] (state, requests) {
    state.requests = state.requests
      .concat(requests)
  },
}

export const actions = {
  [types.LOAD_REQUESTS] ({ rootGetters }) {
    const endpoint = '/v3/create_pre_issuance_requests'
    return api.getWithSignature(endpoint, {
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
  [types.requests]: state => state.requests
    .map(r => new PreIssuanceRequest(r)),
}

export const preIssuanceRequestsModule = {
  name: 'pre-issuance-requests',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
