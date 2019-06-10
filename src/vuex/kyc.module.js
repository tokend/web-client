import { vuexTypes } from './types'

import { api } from '@/api'
import { ChangeRoleRequestRecord } from '@/js/records/requests/change-role.record'

import safeGet from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'

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
  isAccountRoleReseted: false,
  request: {},
  relatedRequest: {},
  latestData: '{}', // JSON string
  latestRequestData: '{}',
}

export const mutations = {
  [vuexTypes.SET_KYC_LATEST_REQUEST] (state, request) {
    state.request = request
  },

  [vuexTypes.SET_KYC_RELATED_REQUEST] (state, request) {
    state.relatedRequest = request
  },

  [vuexTypes.SET_KYC_LATEST_DATA] (state, data) {
    state.latestData = data
  },

  [vuexTypes.SET_KYC_LATEST_REQUEST_DATA] (state, data) {
    state.latestRequestData = data
  },

  [vuexTypes.SET_ACCOUNT_ROLE_RESETED] (state, isReseted) {
    state.isAccountRoleReseted = isReseted
  },
}

export const actions = {
  async [vuexTypes.LOAD_KYC] ({
    dispatch,
  }) {
    await dispatch(vuexTypes.LOAD_KYC_LATEST_REQUEST)
    await dispatch(vuexTypes.LOAD_KYC_LATEST_DATA)
  },

  async [vuexTypes.LOAD_KYC_LATEST_REQUEST] ({
    rootGetters,
    commit,
    dispatch,
  }) {
    const requestor = rootGetters[vuexTypes.accountId]

    // kinda optimization cause we are interested only in
    // the latest change role request
    // please do not expose the request itself for not making clients dependent
    // on this implementation
    const limit = 1
    const order = 'desc'

    const response = await api.getWithSignature(`/v3/change_role_requests`, {
      filter: { requestor },
      page: { limit, order },
      include: ['request_details'],
    })

    if (!response.data[0]) {
      return
    }

    const request = new ChangeRoleRequestRecord(response.data[0])

    if (!_isEmpty(request.creatorDetails)) {
      commit(vuexTypes.SET_KYC_LATEST_REQUEST, request)
    } else {
      commit(vuexTypes.SET_KYC_LATEST_REQUEST, {})
    }

    if (request.relatedRequestId) {
      await dispatch(
        vuexTypes.LOAD_KYC_RELATED_REQUEST,
        request.relatedRequestId
      )
    } else {
      commit(vuexTypes.SET_ACCOUNT_ROLE_RESETED, false)
      commit(vuexTypes.SET_KYC_RELATED_REQUEST, {})
    }

    await dispatch(vuexTypes.LOAD_KYC_LATEST_REQUEST_DATA)
  },

  async [vuexTypes.LOAD_KYC_RELATED_REQUEST] (
    { state, commit, rootGetters },
    requestId
  ) {
    const { data } = await api.getWithSignature(
      `/v3/change_role_requests/${requestId}`,
      {
        filter: { requestor: rootGetters[vuexTypes.accountId] },
        include: ['request_details'],
      }
    )

    const request = new ChangeRoleRequestRecord(data)
    const resetReason = request.resetReason || state.request.resetReason

    commit(vuexTypes.SET_ACCOUNT_ROLE_RESETED, Boolean(resetReason))
    commit(vuexTypes.SET_KYC_RELATED_REQUEST, request)
  },

  async [vuexTypes.LOAD_KYC_LATEST_REQUEST_DATA] (
    { getters, rootGetters, commit }
  ) {
    const latestBlobId = getters[vuexTypes.kycLatestRequestBlobId]
    if (!latestBlobId) {
      return
    }

    const { data: blob } = await api.getWithSignature(
      `/accounts/${rootGetters[vuexTypes.accountId]}/blobs/${latestBlobId}`
    )
    commit(vuexTypes.SET_KYC_LATEST_REQUEST_DATA, blob.value)
  },

  async [vuexTypes.LOAD_KYC_LATEST_DATA] ({ rootGetters, commit }) {
    const accountId = rootGetters[vuexTypes.accountId]
    const { data: account } = await api.getWithSignature(
      `/v3/accounts/${accountId}`,
      { include: ['kyc_data'] }
    )

    const latestBlobId = safeGet(account, 'kycData.kycData.blobId')
    if (!latestBlobId) {
      return
    }

    const latestBlobResponse = await api.getWithSignature(
      `/accounts/${accountId}/blobs/${latestBlobId}`
    )
    const latestData = latestBlobResponse.data.value

    commit(vuexTypes.SET_KYC_LATEST_DATA, latestData)
  },
}

export const getters = {
  [vuexTypes.kycState]: state => state.request.state,
  [vuexTypes.kycStateI]: state => state.request.stateI,

  [vuexTypes.kycRequestRejectReason]: state => state.request.rejectReason,
  [vuexTypes.kycRequestResetReason]: state => state.request.resetReason,
  [vuexTypes.kycRequestBlockReason]: state => state.request.blockReason,
  [vuexTypes.kycRequestExternalDetails]: state => state.request.externalDetails,

  [vuexTypes.isAccountRoleReseted]: state => state.isAccountRoleReseted,
  [vuexTypes.kycAccountRoleToSet]: state => state.isAccountRoleReseted
    ? undefined
    : state.relatedRequest.accountRoleToSet || state.request.accountRoleToSet,
  [vuexTypes.kycPreviousRequestAccountRoleToSet]: state => {
    return state.relatedRequest.accountRoleToSet
  },

  [vuexTypes.kycRequestId]: state => state.request.id,
  [vuexTypes.kycLatestRequestBlobId]: state => state.request.blobId ||
    state.relatedRequest.blobId,
  [vuexTypes.kycLatestData]: state => JSON.parse(state.latestData),
  [vuexTypes.kycLatestRequestData]: state => JSON.parse(
    state.latestRequestData
  ),
  [vuexTypes.kycAvatarKey]: state => safeGet(
    JSON.parse(state.latestData),
    'documents.kyc_avatar.key'
  ),
}

export default {
  state,
  mutations,
  actions,
  getters,
}
