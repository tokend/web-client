import _get from 'lodash/get'
import { vuexTypes } from './types'
import { api } from '../api'
import { BalanceRecord } from '@/js/records/entities/balance.record'

export const state = {
  account: {},
  balancesDetails: [],
}

export const mutations = {
  [vuexTypes.SET_ACCOUNT] (state, account) {
    state.account = account
  },

  [vuexTypes.SET_ACCOUNT_BALANCES_DETAILS] (state, balancesDetails) {
    state.balancesDetails = balancesDetails
  },
}

export const actions = {
  async [vuexTypes.LOAD_ACCOUNT] ({ commit }, accountId) {
    const response = await api.getWithSignature(`/v3/accounts/${accountId}`, {
      include: ['external_system_ids', 'balances', 'balances.state'],
    })
    commit(vuexTypes.SET_ACCOUNT, response.data)
  },

  async [vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS] ({ commit, getters }) {
    const accountId = getters[vuexTypes.accountId]
    const endpoint = `/v3/accounts/${accountId}`
    const { data: account } = await api.getWithSignature(endpoint, {
      include: ['balances.asset', 'balances.state'],
    })

    commit(
      vuexTypes.UPDATE_ASSETS,
      account.balances.map(b => b.asset),
      { root: true }
    )

    commit(vuexTypes.SET_ACCOUNT_BALANCES_DETAILS, account.balances)
  },
}

export const getters = {
  [vuexTypes.account]: state => state.account,
  [vuexTypes.accountId]: state => state.account.id,
  [vuexTypes.accountBalances]: state => state.balancesDetails
    .map(item => new BalanceRecord(item))
    .sort((a, b) => b.convertedBalance - a.convertedBalance),
  [vuexTypes.accountRoleId]: state => Number(
    _get(state.account, 'role.id')
  ),
  [vuexTypes.accountDepositAddresses]: state =>
    state.account.externalSystemIds || {},

  [vuexTypes.isAccountGeneral]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryGeneralRoleId],
  [vuexTypes.isAccountUsAccredited]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryUsAccreditedRoleId],
  [vuexTypes.isAccountUsVerified]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryUsVerifiedRoleId],
  [vuexTypes.isAccountCorporate]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryCorporateRoleId],
  [vuexTypes.isAccountUnverified]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryUnverifiedRoleId],
  [vuexTypes.isAccountBlocked]: (a, getters, b, rootGetters) =>
    getters[vuexTypes.accountRoleId] ===
    rootGetters[vuexTypes.kvEntryBlockedRoleId],
}

export default {
  state,
  mutations,
  actions,
  getters,
}
