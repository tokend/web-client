import { AssetRequest } from '@/js/records/requests/asset-request.record'

import { base } from '@tokend/js-sdk'

import { types } from './types'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'

export const state = {
  requests: [],
  kycRequiredAssetType: null,
  securityAssetType: null,
}

export const mutations = {
  [types.SET_REQUESTS] (state, requests) {
    state.requests = requests
  },
  [types.CONCAT_REQUESTS] (state, requests) {
    state.requests = state.requests.concat(requests)
  },
  [types.SET_SECURITY_ASSET_TYPE] (state, assetType) {
    state.securityAssetType = assetType
  },
  [types.SET_KYC_REQUIRED_ASSET_TYPE] (state, assetType) {
    state.kycRequiredAssetType = assetType
  },
}

export const actions = {
  [types.LOAD_REQUESTS] ({ rootGetters }) {
    return api.getWithSignature('/v3/create_asset_requests', {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: rootGetters[vuexTypes.accountId],
      },
      include: ['request_details'],
    })
  },

  async [types.LOAD_KYC_REQUIRED_ASSET_TYPE] ({ commit }) {
    const endpoint = '/v3/key_values/asset_type:kyc_required'
    const { data } = await api.get(endpoint)

    commit(types.SET_KYC_REQUIRED_ASSET_TYPE, data.value.u32)
  },

  async [types.LOAD_SECURITY_ASSET_TYPE] ({ commit }) {
    const endpoint = '/v3/key_values/asset_type:security'
    const { data } = await api.get(endpoint)

    commit(types.SET_SECURITY_ASSET_TYPE, data.value.u32)
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
  [types.kycRequiredAssetType]: state => state.kycRequiredAssetType,
  [types.securityAssetType]: state => state.securityAssetType,
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
