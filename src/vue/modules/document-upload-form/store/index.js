import { types } from './types'
import { api } from '../_api'

import { base } from '@tokend/js-sdk'

const ACCOUNT_ROLE_ID = '1'
const SIGNER_WEIGHT = '1000'
const SIGNER_IDENTITY = '1'

const CHANGE_ROLE_REQUEST_ID = '0'
const ACCOUNT_ROLE_TO_SET = '2'
const CHANGE_ROLE_REQUEST_TASKS = 3

const BLOB_TYPE = 'kyc_form'

export const state = {
  accountId: '',
  documentAccountId: '',
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },

  [types.SET_DOCUMENT_ACCOUNT_ID] (state, documentAccountId) {
    state.documentAccountId = documentAccountId
  },
}

export const actions = {
  async [types.CREATE_ACCOUNT] ({ commit, getters }, destination) {
    const operation = base.CreateAccountBuilder.createAccount({
      destination,
      roleID: ACCOUNT_ROLE_ID,
      signersData: [{
        roleID: ACCOUNT_ROLE_ID,
        publicKey: getters[types.accountId],
        weight: SIGNER_WEIGHT,
        identity: SIGNER_IDENTITY,
        details: {},
      }],
    })

    await api().postOperations(operation)

    commit(types.SET_DOCUMENT_ACCOUNT_ID, destination)
  },

  async [types.CREATE_CHANGE_ROLE_REQUEST] ({ getters }, blobId) {
    const operation = base.CreateChangeRoleRequestBuilder
      .createChangeRoleRequest({
        requestID: CHANGE_ROLE_REQUEST_ID,
        destinationAccount: getters[types.documentAccountId],
        accountRoleToSet: ACCOUNT_ROLE_TO_SET,
        creatorDetails: {
          blob_id: blobId,
        },
        allTasks: CHANGE_ROLE_REQUEST_TASKS,
      })

    await api().postOperations(operation)
  },

  async [types.CREATE_BLOB] ({ getters }, details) {
    const endpoint = `/accounts/${getters[types.accountId]}/blobs`
    const { data } = await api().postWithSignature(endpoint, {
      data: {
        type: BLOB_TYPE,
        attributes: {
          value: JSON.stringify(details),
        },
      },
    })

    return data.id
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.documentAccountId]: state => state.documentAccountId,
}

export const uploadFormModule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
