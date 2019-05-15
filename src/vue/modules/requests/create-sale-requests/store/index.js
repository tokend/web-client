import { CreateSaleRequest } from '../wrappers/create-sale-request'
import { Asset } from '../wrappers/asset'

import { base } from '@tokend/js-sdk'

import { types } from './types'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'

export const state = {
  requests: [],
  balancesAssets: [],
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
  async [types.LOAD_ASSET_BY_ID] (_, id) {
    const endpoint = `/v3/assets/${id}`
    const { data: record } = await api.get(endpoint)
    return new Asset(record)
  },

  [types.LOAD_REQUESTS] ({ rootGetters }) {
    return api.getWithSignature('/v3/create_sale_requests', {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: rootGetters[vuexTypes.accountId],
      },
      include: ['request_details', 'request_details.default_quote_asset'],
    })
  },

  async [types.CANCEL_REQUEST] (_, requestId) {
    const operation = base.SaleRequestBuilder.cancelSaleCreationRequest({
      requestID: requestId,
    })
    await api.postOperations(operation)
  },
}

export const getters = {
  [types.requests]: state => state.requests
    .map(r => new CreateSaleRequest(r)),
}

export const createSaleRequestsModule = {
  name: 'create-sale-requests',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
