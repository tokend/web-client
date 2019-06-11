import { PollRequest } from '../wrappers/poll-request'

import { base } from '@tokend/js-sdk'

import { types } from './types'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'

export const state = {
  requests: [],
  restrictedPollType: null,
}

export const mutations = {
  [types.SET_REQUESTS] (state, requests) {
    state.requests = requests
  },
  [types.CONCAT_REQUESTS] (state, requests) {
    state.requests = state.requests.concat(requests)
  },
  [types.SET_RESTRICTED_POLL_TYPE] (state, pollType) {
    state.restrictedPollType = pollType
  },
}

export const actions = {
  [types.LOAD_REQUESTS] ({ rootGetters }) {
    return api.getWithSignature('/v3/create_poll_requests', {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: rootGetters[vuexTypes.accountId],
      },
      include: ['request_details'],
    })
  },

  async [types.LOAD_RESTRICTED_POLL_TYPE] ({ commit }) {
    const endpoint = `/v3/key_values/poll_type:restricted`
    const { data } = await api.get(endpoint)

    commit(types.SET_RESTRICTED_POLL_TYPE, data.value.u32)
  },

  async [types.CANCEL_REQUEST] (_, requestId) {
    const operation = base.ManageCreatePollRequestBuilder.cancelPollRequest({
      requestID: requestId,
    })
    await api.postOperations(operation)
  },
}

export const getters = {
  [types.requests]: state => state.requests
    .map(r => new PollRequest(r)),
  [types.restrictedPollType]: state => state.restrictedPollType,
}

export const pollRequestsModule = {
  name: 'poll-requests',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
