import { PreIssuanceRequest } from '../wrappers/pre-issuance-request'

import { types } from './types'
import { api } from '../_api'

export const state = {
  accountId: '',
  requests: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_REQUESTS] (state, requests) {
    state.requests = requests
  },
  [types.CONCAT_REQUESTS] (state, requests) {
    state.requests = state.requests
      .concat(requests)
  },
}

export const actions = {
  [types.LOAD_REQUESTS] ({ getters }) {
    const endpoint = '/v3/create_pre_issuance_requests'
    return api().getWithSignature(endpoint, {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: getters[types.accountId],
      },
      include: ['request_details'],
    })
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
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
