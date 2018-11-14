import { RecordWrapper } from '../js/records'
import { vuexTypes } from './types'
import { Sdk } from '@/sdk'

/**
 * @module
 *
 * The module is needed to encapsulate all kyc-related stuff that is quite
 * complex now. PLEASE DO NOT expose
 * the request itself because this is kind of logic that may take some new
 * changes later. If the higher-lvl client
 * will need more kyc-related data, all logic should be written on that lvl
 * without linking to this module.
 */

export const state = {
  request: {},
  approvedData: '', // JSON string
  latestData: '' // JSON string
}

export const mutations = {
  SET_KYC_LATEST_REQUEST (state, request) {
    state.request = request
  },

  SET_KYC_APPROVED_DATA (state, data) {
    state.approvedData = data
  },

  SET_KYC_LATEST_DATA (state, data) {
    state.latestData = data
  }
}

export const actions = {
  async LOAD_KYC ({ dispatch }) {
    await dispatch(vuexTypes.LOAD_KYC_LATEST_REQUEST)
    await dispatch(vuexTypes.LOAD_KYC_DATA)
  },

  async LOAD_KYC_LATEST_REQUEST ({ rootGetters, commit }) {
    const requestor = rootGetters.accountId

    // kinda optimization cause we are interested only in the latest
    // update_kyc request
    // please do not expose the request itself for not making clients dependent
    // on this implementation
    const limit = 1
    const order = 'desc'

    const response = await Sdk.horizon.request.getAllForUpdateKyc({
      requestor,
      limit,
      order
    })

    if (!response.data[0]) {
      return
    }

    commit(
      vuexTypes.SET_KYC_LATEST_REQUEST,
      RecordWrapper.request(response.data[0])
    )
  },

  async LOAD_KYC_DATA ({ state, getters, rootGetters, commit }) {
    const latestBlobId = state.request.blobId
    if (!latestBlobId) {
      return
    }

    const latestBlobResponse = await Sdk.api.blobs.get(latestBlobId)
    const latestData = latestBlobResponse.data.value
    commit(vuexTypes.SET_KYC_LATEST_DATA, latestData)

    // we know for sure that blob id is being stored in account can be
    // considered as approved
    const approvedBlobId = rootGetters.accountKycBlobId

    if (approvedBlobId === latestBlobId) {
      commit(vuexTypes.SET_KYC_APPROVED_DATA, latestData)
    } else {
      const approvedBlobResponse = await Sdk.api.blobs.get(approvedBlobId)
      commit(vuexTypes.SET_KYC_APPROVED_DATA, approvedBlobResponse.data.value)
    }
  }
}

export const getters = {
  kycState: state => state.request.state,
  kycStateI: state => state.request.stateI,
  kycLatestData: state => JSON.parse(state.latestData),
  kycApprovedData: state => JSON.parse(state.approvedData)
}

export default {
  state,
  mutations,
  actions,
  getters
}
