import { vuexTypes } from './types'

import { api } from '@/api'
import { base } from '@tokend/js-sdk'

import safeGet from 'lodash/get'
import { KYC_RECOVERY_STATES } from '@/js/const/kyc-recovery-states.const'
import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { keyValues } from '@/key-values'

export const state = {
  request: {},
  requestBlob: '{}', // JSON string
}

export const mutations = {
  [vuexTypes.SET_KYC_RECOVERY_LATEST_REQUEST] (state, request) {
    state.request = request
  },
  [vuexTypes.SET_KYC_RECOVERY_LATEST_REQUEST_BLOB] (state, requestData) {
    state.requestBlob = requestData
  },
}

export const actions = {
  async [vuexTypes.LOAD_KYC_RECOVERY] ({
    dispatch,
  }) {
    await dispatch(vuexTypes.LOAD_KYC_RECOVERY_LATEST_REQUEST)
    await dispatch(vuexTypes.LOAD_KYC_RECOVERY_LATEST_REQUEST_BLOB)
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
    commit(vuexTypes.SET_KYC_RECOVERY_LATEST_REQUEST, request)
  },

  async [vuexTypes.LOAD_KYC_RECOVERY_LATEST_REQUEST_BLOB] (
    { getters, rootGetters, commit }
  ) {
    const latestBlobId = getters[vuexTypes.kycRecoveryBlobId]
    if (!latestBlobId) {
      return
    }

    const { data: blob } = await api.getWithSignature(
      `/accounts/${rootGetters[vuexTypes.accountId]}/blobs/${latestBlobId}`
    )
    commit(vuexTypes.SET_KYC_RECOVERY_LATEST_REQUEST_BLOB, blob.value)
  },

  // If blobId is empty, account request will be defined as a request
  // for unverified user
  async [vuexTypes.SEND_KYC_RECOVERY_REQUEST] (
    { getters, rootGetters, commit },
    blobId = ''
  ) {
    const opts = {
      targetAccount: rootGetters[vuexTypes.accountId],
      signers: [
        {
          publicKey: rootGetters[vuexTypes.walletPublicKey],
          roleID: String(keyValues.defaultSignerRoleId),
          weight: '1000',
          identity: '1',
          details: {},
        },
      ],
      creatorDetails: {
        blob_id: blobId,
      },
    }
    const isKycRecoveryInited = getters[vuexTypes.isKycRecoveryInited]
    const isPermanentlyRejected = getters[vuexTypes.kycRecoveryState] ===
      REQUEST_STATES_STR.permanentlyRejected
    let operation
    if (isKycRecoveryInited || isPermanentlyRejected) {
      operation = base.CreateKYCRecoveryRequestBuilder.create(opts)
    } else {
      operation = base.CreateKYCRecoveryRequestBuilder.update(
        opts,
        getters[vuexTypes.kycRecoveryRequestId]
      )
    }
    await api.postOperations(operation)
  },
}

export const getters = {
  [vuexTypes.kycRecoveryRequestId]: state => safeGet(state,
    'request.id'),
  [vuexTypes.kycRecoveryState]: state => safeGet(state,
    'request.state'),
  [vuexTypes.kycRecoveryStateI]: state => safeGet(state,
    'request.stateI'),
  [vuexTypes.kycRecoveryRequestBlob]: state => JSON.parse(state.requestBlob),
  [vuexTypes.kycRecoveryRejectReason]: state => safeGet(state,
    'request.rejectReason'),
  [vuexTypes.accountKycRecoveryStatus]: (state, rootGetters) =>
    safeGet(rootGetters[vuexTypes.account], 'kycRecoveryStatus.value'),

  [vuexTypes.isNoKycRecoveryInProgress]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] ===
    KYC_RECOVERY_STATES.none,
  [vuexTypes.isKycRecoveryInProgress]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] !==
    KYC_RECOVERY_STATES.none && !!getters[vuexTypes.accountKycRecoveryStatus],
  [vuexTypes.isKycRecoveryInited]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] ===
    KYC_RECOVERY_STATES.inited,
  [vuexTypes.isKycRecoveryApproved]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] ===
    KYC_RECOVERY_STATES.approved,
  [vuexTypes.isKycRecoveryPending]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] ===
    KYC_RECOVERY_STATES.pending,
  [vuexTypes.isKycRecoveryRejected]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] ===
    KYC_RECOVERY_STATES.rejected,
  [vuexTypes.isKycRecoveryPermanentlyRejected]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountKycRecoveryStatus] ===
    KYC_RECOVERY_STATES.permanentlyRejected,
  [vuexTypes.kycRecoveryBlobId]: state => safeGet(state,
    'request.requestDetails.creatorDetails.blobId'),
}

export default {
  state,
  mutations,
  actions,
  getters,
}
