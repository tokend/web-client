import { IssuanceRequest } from '@/js/records/requests/issuance-request.record'

import { api } from '@/api'
import { vuexTypes } from './types'

export const state = {
  issuances: [],
}

export const mutations = {
  [vuexTypes.SET_ISSUANCES] (state, issuances) {
    state.issuances = issuances
  },
  [vuexTypes.CONCAT_ISSUANCES] (state, issuances) {
    state.issuances = state.issuances.concat(issuances)
  },
}

export const actions = {
  [vuexTypes.LOAD_ISSUANCES] ({ rootGetters }) {
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
  [vuexTypes.issuances]:
    state => state.issuances.map(i => new IssuanceRequest(i)),
}

export default {
  state,
  getters,
  actions,
  mutations,
}
