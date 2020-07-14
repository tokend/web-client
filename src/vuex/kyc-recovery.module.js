import { vuexTypes } from './types'
import { BlobRecord } from '@/js/records/entities/blob.record'
import { KycRecoveryRequestRecord } from '@/js/records/requests/kyc-recovery-request.record'
import { getLatestRequest, getPrivateBlob } from '@/js/helpers/api-helpers'
import { createKycRecord } from '@/js/helpers/kyc-helpers'

export const state = {
  request: {},
  requestBlob: {},
}

export const mutations = {
  [vuexTypes.SET_KYC_RECOVERY_REQUEST] (state, value) {
    state.request = value
  },
  [vuexTypes.SET_KYC_RECOVERY_REQUEST_BLOB] (state, value) {
    state.requestBlob = value
  },
}

export const actions = {
  async [vuexTypes.LOAD_KYC_RECOVERY] ({ dispatch }) {
    await dispatch(vuexTypes.LOAD_KYC_RECOVERY_REQUEST)
    await dispatch(vuexTypes.LOAD_KYC_RECOVERY_REQUEST_BLOB)
  },

  async [vuexTypes.LOAD_KYC_RECOVERY_REQUEST] ({ commit, rootGetters }) {
    const request = await getLatestRequest('/v3/kyc_recovery_requests')

    const requestRecord = new KycRecoveryRequestRecord(request)
    const isOutdatedRequest =
      requestRecord.isApproved &&
      rootGetters[vuexTypes.isAccountKycRecoveryInitiated]
    if (isOutdatedRequest) return

    commit(vuexTypes.SET_KYC_RECOVERY_REQUEST, request)
  },

  async [vuexTypes.LOAD_KYC_RECOVERY_REQUEST_BLOB] ({ getters, commit }) {
    const blobId = getters[vuexTypes.kycRecoveryRequest].blobId
    if (!blobId) return

    const blob = await getPrivateBlob(blobId)
    commit(vuexTypes.SET_KYC_RECOVERY_REQUEST_BLOB, blob)
  },
}

export const getters = {
  [vuexTypes.kycRecoveryRequest]: state => {
    const kyc = createKycRecord(new BlobRecord(state.requestBlob))
    return new KycRecoveryRequestRecord(state.request, kyc)
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
