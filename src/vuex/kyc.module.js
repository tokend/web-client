import { vuexTypes } from './types'
import { Sdk } from '@/sdk'
import { Api } from '@/api'
import { ChangeRoleRequestRecord } from '@/js/records/requests/change-role.record'
import safeGet from 'lodash/get'

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
  latestData: '{}', // JSON string
}

export const mutations = {
  [vuexTypes.SET_KYC_LATEST_REQUEST] (state, request) {
    state.request = request
  },

  [vuexTypes.SET_KYC_LATEST_DATA] (state, data) {
    state.latestData = data
  },

  [vuexTypes.SET_ACCOUNT_ROLE_RESET] (state, isReset) {
    state.isAccountRoleReseted = isReset
  },
}

export const actions = {
  async [vuexTypes.LOAD_KYC] ({
    dispatch,
  }) {
    await dispatch(vuexTypes.LOAD_KYC_LATEST_REQUEST)
    await dispatch(vuexTypes.LOAD_KYC_DATA)
  },

  async [vuexTypes.LOAD_KYC_LATEST_REQUEST] ({
    rootGetters,
    commit,
  }) {
    const requestor = rootGetters[vuexTypes.accountId]

    // kinda optimization cause we are interested only 2 latest
    // update_kyc request
    // please do not expose the request itself for not making clients dependent
    // on this implementation
    const limit = 2
    const order = 'desc'

    const response = await Api.getWithSignature(`change_role_requests`, {
      filter: {
        requestor,
      },
      page: {
        limit,
        order,
      },
      include: ['request_details'],
    })

    if (!response.data[0]) {
      return
    }
    const request = new ChangeRoleRequestRecord(
      response.data[0],
      response.data[1]
    )
    const unverifiedRoleId = rootGetters[vuexTypes.kvEntryUnverifiedRoleId]
    const isAccountRoleReseted = request.accountRoleToSet === unverifiedRoleId

    commit(vuexTypes.SET_ACCOUNT_ROLE_RESET, isAccountRoleReseted)
    commit(vuexTypes.SET_KYC_LATEST_REQUEST, request)
  },

  async [vuexTypes.LOAD_KYC_DATA] ({
    state,
    rootGetters,
    commit,
  }) {
    const latestBlobId = state.request.blobId
    if (!latestBlobId) {
      return
    }
    const latestBlobResponse = await Sdk.api.blobs.get(latestBlobId)
    const latestData = latestBlobResponse.data.value
    commit(vuexTypes.SET_KYC_LATEST_DATA, latestData)
  },
}

export const getters = {
  [vuexTypes.kycState]: state => state.request.state,
  [vuexTypes.kycStateI]: state => state.request.stateI,
  [vuexTypes.kycRequestRejectReason]: state => state.request.rejectReason,
  [vuexTypes.kycRequestResetReason]: state => state.request.resetReason,
  [vuexTypes.kycAccountRoleToSet]: state => state.isAccountRoleReseted
    ? undefined
    : state.request.accountRoleToSet,
  [vuexTypes.kycPreviousAccountRole]: state =>
    state.request.previousAccountRole,
  [vuexTypes.kycRequestId]: state => state.request.id,
  [vuexTypes.kycLatestData]: state => JSON.parse(state.latestData),
  [vuexTypes.kycAvatarKey]: state => safeGet(
    JSON.parse(state.latestData),
    'documents.kyc_avatar.key'
  ),
  [vuexTypes.isAccountRoleReseted]: state => state.isAccountRoleReseted,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
