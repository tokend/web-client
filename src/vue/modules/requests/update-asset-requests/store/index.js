import { UpdateAssetRequest } from '../wrappers/update-asset-request'

import { base } from '@tokend/js-sdk'

import { types } from './types'
import { api } from '@/api'

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
    return api().getWithSignature('/v3/update_asset_requests', {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: getters[types.accountId],
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
  [types.accountId]: state => state.accountId,
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
