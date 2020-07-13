import { vuexTypes } from './types'

import { api } from '@/api'
import { base } from '@tokend/js-sdk'

import get from 'lodash/get'
import { keyValues } from '@/key-values'
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

  // TODO: remove
  // If blobId is empty, account request will be defined as a request
  // for unverified user
  async [vuexTypes.SEND_KYC_RECOVERY_REQUEST] (
    { getters, rootGetters, dispatch },
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
      creatorDetails: {},
    }
    const request = getters[vuexTypes.kycRecoveryRequest]
    const isInitiated = getters[vuexTypes.isAccountKycRecoveryInitiated]
    let operation
    if (isInitiated || request.isPermanentlyRejected) {
      operation = base.CreateKYCRecoveryRequestBuilder.create(opts)
    } else {
      operation = base.CreateKYCRecoveryRequestBuilder.update(
        opts,
        getters[vuexTypes.kycRecoveryRequestId]
      )
    }
    await api.postOperations(operation)
    await dispatch(vuexTypes.LOAD_KYC_RECOVERY)
  },
}

export const getters = {
  [vuexTypes.kycRecoveryRequest]: state => {
    const kyc = createKycRecord(new BlobRecord(state.requestBlob))
    return new KycRecoveryRequestRecord(state.request, kyc)
  },

  // TODO: remove
  [vuexTypes.kycRecoveryRequestId]: state => get(state, 'request.id'),
  [vuexTypes.kycRecoveryState]: state => get(state, 'request.stateI'),
  [vuexTypes.kycRecoveryRequestBlob]: state => JSON.parse(state.requestBlob),
  [vuexTypes.kycRecoveryBlobId]: state => get(state, 'request.requestDetails.creatorDetails.blobId'),
}

export default {
  state,
  mutations,
  actions,
  getters,
}
