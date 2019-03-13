import { types } from './types'
import { api } from '../_api'
import { AssetRecord } from '../wrappers/asset.record'

export const actions = {
  async [types.LOAD_KV_KYC_REQUIRED] ({ commit, getters }) {
    const { data } = await api().get(`v3/key_values/asset_type:kyc_required`)
    return data.value.u32
  },
  async [types.LOAD_ASSETS] ({ commit, getters }) {
    const { data } = await api().get(`v3/assets`)
    return data.map(item => new AssetRecord(item))
  },
  async [types.LOAD_BLOB_ID] ({ commit }, data) {
    const response = await api()
      .postWithSignature(`accounts/${data.accountId}/blobs`, {
        data: data.params,
      })
    return response.data.id
  },
}

export const createAssetSaleModule = {
  namespaced: true,
  actions,
}
