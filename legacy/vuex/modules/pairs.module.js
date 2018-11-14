import { vuexTypes } from '../types'
import { RecordFactory } from '../../js/records/factory'
import { pairsService } from '../../js/services/pairs.service'

const state = {
  asset_pairs: []
}

export const mutations = {
  SET_ASSET_PAIRS: (state, assetPairs) => {
    state.asset_pairs = assetPairs
  }
}

export const actions = {
  async GET_ASSET_PAIRS ({ commit }) {
    const records = await pairsService.loadAssetPairs()
    const pairs = records.map(record =>
      RecordFactory.createAssetPairRecord(record)
    )
    commit(vuexTypes.SET_ASSET_PAIRS, pairs)
  }
}

export const getters = {
  assetPairs: state => state.asset_pairs,
  tradablePairs: state => state.asset_pairs.filter(pair => pair.isTradable)
}

export default {
  actions,
  getters,
  mutations,
  state
}
