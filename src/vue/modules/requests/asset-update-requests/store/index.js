import { AssetUpdateRequest } from '../wrappers/asset-update-request'

import { base } from '@tokend/js-sdk'

import { types } from './types'
import { api } from '../_api'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  accountId: '',
  assetUpdateRequests: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_ASSET_UPDATE_REQUESTS] (state, assetUpdateRequests) {
    state.assetUpdateRequests = assetUpdateRequests
  },
  [types.CONCAT_ASSET_UPDATE_REQUESTS] (state, assetUpdateRequests) {
    state.assetUpdateRequests = state.assetUpdateRequests
      .concat(assetUpdateRequests)
  },
}

export const actions = {
  [types.LOAD_ASSET_UPDATE_REQUESTS] ({ getters }) {
    return api().getWithSignature(`/${HORIZON_VERSION_PREFIX}/update_asset_requests`, {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: getters[types.accountId],
      },
      include: ['request_details'],
    })
  },

  async [types.CANCEL_ASSET_UPDATE_REQUEST] (_, requestId) {
    const operation = base.ManageAssetBuilder.cancelAssetRequest({
      requestID: requestId,
    })
    await api().postOperations(operation)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.assetUpdateRequests]: state => state.assetUpdateRequests
    .map(r => new AssetUpdateRequest(r)),
}

export const assetUpdateRequestsModule = {
  name: 'asset-update-requests',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
