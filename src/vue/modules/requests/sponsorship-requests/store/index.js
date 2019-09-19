import { SponsorshipRequest } from '../wrappers/sponsorship-request'

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
    state.requests = state.requests.concat(requests)
  },
}

export const actions = {
  [types.LOAD_REQUESTS] ({ rootGetters }, isIncomingRequests) {
    return api.getWithSignature('/integrations/sponsorship/contracts', {
      filter: {
        ...(isIncomingRequests
          ? { consumer_business: rootGetters[vuexTypes.accountId] }
          : { sponsor_business: rootGetters[vuexTypes.accountId] }
        ),
      },
    })
  },

  async [types.APPROVE_OR_REJECT_REQUEST] (_, { requestId, action }) {
    await api.postWithSignature(`/integrations/sponsorship/contracts/${requestId}`, {
      action: action,
    })
  },
}

export const getters = {
  [types.requests]: state => state.requests
    .map(r => new SponsorshipRequest(r)),
}

export const sponsorshipRequestsModule = {
  name: 'sponsorship-requests',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
