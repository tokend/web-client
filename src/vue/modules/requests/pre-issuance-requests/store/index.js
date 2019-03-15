import { PreIssuanceRequest } from '../wrappers/pre-issuance-request'

import { types } from './types'
import { api } from '../_api'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  accountId: '',
  preIssuanceRequests: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_PRE_ISSUANCE_REQUESTS] (state, preIssuanceRequests) {
    state.preIssuanceRequests = preIssuanceRequests
  },
  [types.CONCAT_PRE_ISSUANCE_REQUESTS] (state, preIssuanceRequests) {
    state.preIssuanceRequests = state.preIssuanceRequests
      .concat(preIssuanceRequests)
  },
}

export const actions = {
  [types.LOAD_PRE_ISSUANCE_REQUESTS] ({ getters }) {
    const endpoint = `/${HORIZON_VERSION_PREFIX}/create_pre_issuance_requests`
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
  [types.preIssuanceRequests]: state => state.preIssuanceRequests
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
