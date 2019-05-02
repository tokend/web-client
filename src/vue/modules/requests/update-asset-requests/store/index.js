import { UpdateAssetRequest } from '../wrappers/update-asset-request'

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
    return api().getWithSignature('/v3/update_asset_requests', {
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
    await api().postOperations(operation)
  },
}

export const getters = {
  [types.requests]: state => state.requests
    .map(r => new UpdateAssetRequest(r)),
}

export const updateAssetRequestsModule = {
  name: 'update-asset-requests',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
