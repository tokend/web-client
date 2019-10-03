import { SponsorshipRequest } from '@/vue/modules/requests/sponsorship-requests/wrappers/sponsorship-request'

import { api } from '@/api'
import { vuexTypes } from './types'

export const state = {
  requests: [],
}

export const mutations = {
  [vuexTypes.SET_SPONSORSHIP_REQUESTS] (state, requests) {
    state.requests = requests
  },
  [vuexTypes.CONCAT_SPONSORSHIP_REQUESTS] (state, requests) {
    state.requests = state.requests.concat(requests)
  },
}

export const actions = {
  [vuexTypes.LOAD_SPONSORSHIP_REQUESTS] ({ rootGetters }, isIncomingRequests) {
    return api.getWithSignature('/integrations/sponsorship/contracts', {
      filter: {
        ...(isIncomingRequests
          ? { consumer_business: rootGetters[vuexTypes.accountId] }
          : { sponsor_business: rootGetters[vuexTypes.accountId] }
        ),
      },
    })
  },

  // eslint-disable-next-line max-len
  async [vuexTypes.APPROVE_OR_REJECT_SPONSORSHIP_REQUEST] (_, { requestId, action }) {
    await api.postWithSignature(`/integrations/sponsorship/contracts/${requestId}`, {
      action: action,
    })
  },
}

export const getters = {
  [vuexTypes.sponsorshipRequests]: state => state.requests
    .map(r => new SponsorshipRequest(r)),
}

export default {
  state,
  getters,
  actions,
  mutations,
}
