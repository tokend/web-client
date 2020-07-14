import { vuexTypes } from './types'

import { api } from '@/api'
import { KycRequestRecord } from '@/js/records/requests/kyc-request.record'

import get from 'lodash/get'
import set from 'lodash/set'
import { getPrivateBlob, getLatestRequest, getRequest } from '@/js/helpers/api-helpers'
import { createKycRecord } from '@/js/helpers/kyc-helpers'
import { BlobRecord } from '@/js/records/entities/blob.record'

export const state = {
  request: {},
  requestBlob: {},
  kycBlob: {},
}

export const mutations = {
  [vuexTypes.SET_KYC_REQUEST] (state, request) {
    state.request = request
  },

  [vuexTypes.SET_KYC_REQUEST_BLOB] (state, data) {
    state.requestBlob = data
  },

  [vuexTypes.SET_KYC_BLOB] (state, data) {
    state.kycBlob = data
  },
}

export const actions = {
  async [vuexTypes.LOAD_KYC] ({
    dispatch,
  }) {
    await dispatch(vuexTypes.LOAD_KYC_REQUEST)
    await dispatch(vuexTypes.LOAD_KYC_REQUEST_BLOB)
    await dispatch(vuexTypes.LOAD_KYC_BLOB)
  },

  async [vuexTypes.LOAD_KYC_REQUEST] ({ rootGetters, commit }) {
    const rawRequest = await getLatestRequest('/v3/change_role_requests')

    const request = new KycRequestRecord(rawRequest)
    if (request.isReset) {
      const prevReqId = request.prevApprovedReqId
      const rawPrevRequest = await getRequest('/v3/change_role_requests', prevReqId)
      set(rawPrevRequest, 'requestDetails.creatorDetails.resetReason',
        request.resetReason)
      commit(vuexTypes.SET_KYC_REQUEST, rawPrevRequest)
    } else {
      commit(vuexTypes.SET_KYC_REQUEST, rawRequest)
    }
  },

  async [vuexTypes.LOAD_KYC_REQUEST_BLOB] ({ getters, commit }) {
    const blobId = getters[vuexTypes.kycRequest].blobId
    if (!blobId) return

    const blob = await getPrivateBlob(blobId)
    commit(vuexTypes.SET_KYC_REQUEST_BLOB, blob)
  },

  async [vuexTypes.LOAD_KYC_BLOB] ({ rootGetters, commit }) {
    const accountId = rootGetters[vuexTypes.accountId]
    const { data: account } = await api.getWithSignature(
      `/v3/accounts/${accountId}`,
      { include: ['kyc_data'] }
    )

    const blobId = get(account, 'kycData.kycData.blobId')
    if (!blobId) return

    const blob = await getPrivateBlob(blobId)
    commit(vuexTypes.SET_KYC_BLOB, blob)
  },
}

export const getters = {
  [vuexTypes.kyc]: state => createKycRecord(new BlobRecord(state.kycBlob)),
  [vuexTypes.kycRequest]: state => {
    const kyc = createKycRecord(new BlobRecord(state.requestBlob))
    return new KycRequestRecord(state.request, kyc)
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
