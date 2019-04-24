import { CreateSaleRequest } from '../wrappers/create-sale-request'
import { Asset } from '../wrappers/asset'

import { base } from '@tokend/js-sdk'

import { types } from './types'
import { api } from '../_api'

export const state = {
  accountId: '',
  requests: [],
  balancesAssets: [],
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
  async [types.LOAD_ASSET_BY_ID] (_, id) {
    const endpoint = `/v3/assets/${id}`
    const { data: record } = await api().get(endpoint)
    return new Asset(record)
  },

  [types.LOAD_REQUESTS] ({ getters }) {
    return api().getWithSignature(`/v3/create_sale_requests`, {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: getters[types.accountId],
      },
      include: ['request_details', 'request_details.default_quote_asset'],
    })
  },

  async [types.CANCEL_REQUEST] (_, requestId) {
    const operation = base.SaleRequestBuilder.cancelSaleCreationRequest({
      requestID: requestId,
    })
    await api().postOperations(operation)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
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
