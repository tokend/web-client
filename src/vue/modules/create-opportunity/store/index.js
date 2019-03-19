import { types } from './types'
import { api } from '../_api'

const HORIZON_VERSION_PREFIX = 'v3'

export const actions = {
  async [types.LOAD_KV_KYC_REQUIRED] ({ commit, getters }) {
    const { data } = await api().get(`${HORIZON_VERSION_PREFIX}/key_values/asset_type:kyc_required`)
    return data.value.u32
  },
  async [types.LOAD_ASSETS] ({ commit, getters }) {
    let response = await api().get(`${HORIZON_VERSION_PREFIX}/assets`)
    let assets = response.data
    while (response.data.length) {
      response = await response.fetchNext()
      assets = [...assets, ...response.data]
    }
    return assets
  },
  async [types.LOAD_BLOB_ID] ({ commit }, data) {
    const response = await api()
      .postWithSignature(`/blobs`, {
        data: data,
      })
    return response.data.id
  },
}

export const createAssetSaleModule = {
  name: 'create-opportunity',
  namespaced: true,
  actions,
}
