import { api } from '@/api'
import { vuexTypes } from './types'

export const state = {
  kycRequiredAssetType: null,
  securityAssetType: null,
}

export const mutations = {
  [vuexTypes.SET_KYC_REQUIRED_ASSET_TYPE] (state, assetType) {
    state.kycRequiredAssetType = assetType
  },
  [vuexTypes.SET_SECURITY_ASSET_TYPE] (state, assetType) {
    state.securityAssetType = assetType
  },
}

export const actions = {
  async [vuexTypes.LOAD_KYC_REQUIRED_ASSET_TYPE] ({ commit }) {
    const endpoint = '/v3/key_values/asset_type:kyc_required'
    const { data } = await api.get(endpoint)

    commit(vuexTypes.SET_KYC_REQUIRED_ASSET_TYPE, data.value.u32)
  },

  async [vuexTypes.LOAD_SECURITY_ASSET_TYPE] ({ commit }) {
    const endpoint = `/v3/key_values/asset_type:security`
    const { data } = await api.get(endpoint)

    commit(vuexTypes.SET_SECURITY_ASSET_TYPE, data.value.u32)
  },
}

export const getters = {
  [vuexTypes.kycRequiredAssetType]: state => state.kycRequiredAssetType,
  [vuexTypes.securityAssetType]: state => state.securityAssetType,
}

export default {
  mutations,
  actions,
  getters,
  state,
}
