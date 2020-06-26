import { AssetRequest } from '@/js/records/requests/asset-request.record'

import { base } from '@tokend/js-sdk'

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
    return api.getWithSignature('/v3/update_asset_requests', {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: rootGetters[vuexTypes.accountId],
      },
      include: ['request_details'],
    })
  },

  async [types.CANCEL_REQUEST] (_, requestId) {
    const operation = base.ManageAssetBuilder.cancelAssetRequest({
      requestID: requestId,
    })
    await api.postOperations(operation)
  },
}

export const getters = {
  [types.requests]: state => state.requests
    .map(r => new AssetRequest(r)),
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
