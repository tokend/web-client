import _get from 'lodash/get'
import { AccountHelper } from './account.helper'
import { vuexTypes } from './types'
import { Sdk } from '../sdk'

export const state = {
  account: {},
  balancesDetails: []
}

export const mutations = {
  SET_ACCOUNT (state, account) {
    state.account = account
  },

  SET_ACCOUNT_BALANCES_DETAILS (state, balancesDetails) {
    state.balancesDetails = balancesDetails
  }
}

export const actions = {
  async LOAD_ACCOUNT ({ commit }, accountId) {
    const response = await Sdk.horizon.account.get(accountId)
    commit(vuexTypes.SET_ACCOUNT, response.data)
  },

  async LOAD_ACCOUNT_BALANCES_DETAILS ({ commit, getters }) {
    const accountId = getters[vuexTypes.accountId]
    const response = await Sdk.horizon.account.getDetails(accountId)

    commit(vuexTypes.SET_ACCOUNT_BALANCES_DETAILS, response.data)
  }
}

export const getters = {
  account: state => state.account,
  accountId: state => state.account.id,
  accountIsBlocked: state => state.account.isBlocked,
  accountBlockReasons: state => state.account.blockReasons,
  accountType: state => state.account.accountType,
  accountTypeI: state => state.account.accountTypeI,
  accountThresholds: state => state.account.thresholds,
  accountReferrer: state => state.account.referrer,
  accountReferrals: state => state.account.referrals,
  accountPoliciesTypeI: state => _get(
    state.account, 'policies.accountPoliciesTypeI'
  ),
  accountPoliciesTypes: state => _get(
    state.account, 'policies.accountPoliciesTypes', []
  ), // accountPoliciesTypes can be null if not present, so here we
  // overwrite it for easier interface
  // accountBalances: [], // TODO
  accountDepositAddresses: state => AccountHelper.groupExternalSystemAccounts(
    state.account.externalSystemAccounts
  ),
  accountKycBlobId: state => _get(state.account, 'accountKyc.kycData.blobId')
}

export default {
  state,
  mutations,
  actions,
  getters
}
