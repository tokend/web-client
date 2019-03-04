import { AssetCreationRequest } from '../wrappers/asset-creation-request'

import { types } from './types'
import { api } from '../_api'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  accountId: '',
  assetCreationRequests: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_ASSET_CREATION_REQUESTS] (state, assetCreationRequests) {
    state.assetCreationRequests = assetCreationRequests
  },
  [types.CONCAT_ASSET_CREATION_REQUESTS] (state, assetCreationRequests) {
    state.assetCreationRequests = state.assetCreationRequests
      .concat(assetCreationRequests)
  },
}

export const actions = {
  [types.LOAD_ASSET_CREATION_REQUESTS] ({ getters }) {
    return api().getWithSignature(`/${HORIZON_VERSION_PREFIX}/create_asset_requests`, {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: getters[types.accountId],
      },
    })
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.assetCreationRequests]: state => state.assetCreationRequests
    .map(r => new AssetCreationRequest(r)),
}

export const assetCreationRequestsModule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
