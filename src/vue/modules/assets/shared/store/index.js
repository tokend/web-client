import { api } from '@/api'
import { types } from './types'

export const state = {
  kycRequiredAssetType: null,
  securityAssetType: null,
}

export const mutations = {
  [types.SET_KYC_REQUIRED_ASSET_TYPE] (state, assetType) {
    state.kycRequiredAssetType = assetType
  },
  [types.SET_SECURITY_ASSET_TYPE] (state, assetType) {
    state.securityAssetType = assetType
  },
}

export const actions = {
  async [types.LOAD_KYC_REQUIRED_ASSET_TYPE] ({ commit }) {
    const endpoint = '/v3/key_values/asset_type:kyc_required'
    const { data } = await api.get(endpoint)

    commit(types.SET_KYC_REQUIRED_ASSET_TYPE, data.value.u32)
  },

  async [types.LOAD_SECURITY_ASSET_TYPE] ({ commit }) {
    const endpoint = `/v3/key_values/asset_type:security`
    const { data } = await api.get(endpoint)

    commit(types.SET_SECURITY_ASSET_TYPE, data.value.u32)
  },
}

export const getters = {
  [types.kycRequiredAssetType]: state => state.kycRequiredAssetType,
  [types.securityAssetType]: state => state.securityAssetType,
}

export default {
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
}
