import { vuexTypes } from './types'

import { api } from '@/api'
import { KycRequestRecord } from '@/js/records/requests/kyc-request.record'

import get from 'lodash/get'
import set from 'lodash/set'
import { getPrivateBlob, getLatestRequest, getRequest } from '@/js/helpers/api-helpers'
import { createKycRecord } from '@/js/helpers/kyc-helpers'
import { BlobRecord } from '@/js/records/entities/blob.record'

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
  isAccountRoleReset: false,
  request: {},
  requestBlob: {},
  prevApprovedRequest: {},
  kycBlob: {},
  latestRequestData: '{}',
}

export const mutations = {
  [vuexTypes.SET_KYC_REQUEST] (state, request) {
    state.request = request
  },

  [vuexTypes.SET_KYC_REQUEST_BLOB] (state, data) {
    state.requestBlob = data
  },

  [vuexTypes.SET_PREV_APPROVED_KYC_REQUEST] (state, request) {
    state.prevApprovedRequest = request
  },

  [vuexTypes.SET_KYC_BLOB] (state, data) {
    state.kycBlob = data
  },

  // TODO: remove
  [vuexTypes.SET_IS_ACCOUNT_ROLE_RESET] (state, value) {
    state.isAccountRoleReset = value
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
  [vuexTypes.kycRequest]: state =>
    new KycRequestRecord(state.request, new BlobRecord(state.requestBlob)),

  // TODO: remove
  [vuexTypes.kycState]: (_, getters) => getters[vuexTypes.kycRequest].state,
  [vuexTypes.isAccountRoleReset]: state => state.isAccountRoleReset,
  [vuexTypes.kycAccountRoleToSet]: (state, getters) => state.isAccountRoleReset
    ? undefined
    : state.prevApprovedRequest.accountRoleToSet ||
    getters[vuexTypes.kycRequest].accountRoleToSet,
  [vuexTypes.kycPreviousRequestAccountRoleToSet]:
    state => state.prevApprovedRequest.accountRoleToSet,
  [vuexTypes.kycLatestRequestData]:
    state => JSON.parse(state.latestRequestData),
  [vuexTypes.kycLatestRequestBlobId]: state => state.request.blobId ||
    state.prevApprovedRequest.blobId,

  [vuexTypes.kycRequestId]: (_, getters) =>
    getters[vuexTypes.kycRequest].id,

  [vuexTypes.kycRequestRejectReason]: (_, getters) =>
    getters[vuexTypes.kycRequest].rejectReason,

  [vuexTypes.kycRequestResetReason]: (_, getters) =>
    getters[vuexTypes.kycRequest].resetReason,

  [vuexTypes.kycRequestBlockReason]: (_, getters) =>
    getters[vuexTypes.kycRequest].blockReason,

  [vuexTypes.kycRequestExternalDetails]: (_, getters) =>
    getters[vuexTypes.kycRequest].externalDetails,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
