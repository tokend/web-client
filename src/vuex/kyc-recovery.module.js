import { vuexTypes } from './types'

import { api } from '@/api'

import safeGet from 'lodash/get'
import { KYC_RECOVERY_STATES } from '@/js/const/kyc-recovery-states.const'

export const state = {
  request: {},
  requestData: '{}', // JSON string
}

export const mutations = {
  [vuexTypes.SET_KYC_RECOVERY_LATEST_REQUEST] (state, request) {
    state.request = request
  },
  [vuexTypes.SET_KYC_RECOVERY_LATEST_REQUEST_DATA] (state, request) {
    state.requestData = request
  },
}

export const actions = {
  async [vuexTypes.LOAD_KYC_RECOVERY] ({
    dispatch,
  }) {
    await dispatch(vuexTypes.LOAD_KYC_RECOVERY_LATEST_REQUEST)
  },

  async [vuexTypes.LOAD_KYC_RECOVERY_LATEST_REQUEST] ({
    rootGetters,
    commit,
  }) {
    const requestor = rootGetters[vuexTypes.accountId]
    const limit = 1
    const order = 'desc'

    const response = await api.getWithSignature(`/v3/kyc_recovery_requests`, {
      filter: { requestor },
      page: { limit, order },
      include: ['request_details'],
    })
    const request = response.data[0]
    const requestData = safeGet(request,
      'requestDetails.creatorDetails.verificationData')
    commit(vuexTypes.SET_KYC_RECOVERY_LATEST_REQUEST, request)
    commit(vuexTypes.SET_KYC_RECOVERY_LATEST_REQUEST_DATA, requestData)
  },
}

export const getters = {
  [vuexTypes.kycRecoveryRequestId]: state => safeGet(state,
    'request.id'),
  [vuexTypes.kycRecoveryState]: state => safeGet(state,
    'request.state'),
  [vuexTypes.kycRecoveryStateI]: state => safeGet(state,
    'request.stateI'),
  [vuexTypes.kycRecoveryRequestData]: state => JSON.parse(state.requestData),

  [vuexTypes.isNoKycRecoveryInProgress]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] ===
    KYC_RECOVERY_STATES.none,
  [vuexTypes.isKycRecoveryInited]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] ===
    KYC_RECOVERY_STATES.inited,
  [vuexTypes.isKycRecoveryPending]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryPending] ===
    KYC_RECOVERY_STATES.pending,
  [vuexTypes.isKycRecoveryRejected]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] ===
    KYC_RECOVERY_STATES.rejected,
  [vuexTypes.isKycRecoveryPermanentlyRejected]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] ===
    KYC_RECOVERY_STATES.permanently_rejected,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
