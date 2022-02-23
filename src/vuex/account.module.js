import get from 'lodash/get'
import { vuexTypes } from './types'
import { api } from '../api'
import { BalanceRecord } from '@/js/records/entities/balance.record'
import { keyValues } from '@/key-values'
import { getCurrentAccId } from '@/js/helpers/api-helpers'

const ACCOUNT_KYC_RECOVERY_STATES = {
  none: 0,
  initiated: 1,
  pending: 2,
  rejected: 3,
  permanentlyRejected: 4,
  // NOTE: nothing similar with state of Kyc Recovery requests!
}

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
    accountId = accountId || getCurrentAccId()
    const response = await api.getWithSignature(`/v3/accounts/${accountId}`, {
      include: ['external_system_ids', 'balances', 'balances.state', 'balances.asset'],
    })
    commit(vuexTypes.SET_ACCOUNT, response.data)
  },

  async [vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS] (
    { commit, rootGetters, getters },
  ) {
    const accountId = getters[vuexTypes.accountId]
    const defaultQuoteAsset = rootGetters[vuexTypes.defaultQuoteAsset]

    const endpoint = `/v3/accounts/${accountId}/converted_balances/${defaultQuoteAsset}`
    const { data } = await api.getWithSignature(endpoint, {
      include: ['states', 'balance', 'balance.state', 'balance.asset'],
    })

    const balances = data.states.map(state => state.balance)

    commit(
      vuexTypes.UPDATE_ASSETS,
      balances.map(b => b.asset),
      { root: true },
    )
    commit(vuexTypes.SET_ACCOUNT_BALANCES_DETAILS, balances)
  },
}

export const getters = {
  [vuexTypes.account]: state => state.account,
  [vuexTypes.accountId]: state => state.account.id,
  [vuexTypes.accountBalances]: state => state.balancesDetails
    .map(item => new BalanceRecord(item)),
  [vuexTypes.accountOwnedAssetsBalances]: state => state.balancesDetails
    .map(item => new BalanceRecord(item))
    .filter(i => i.asset.owner === state.account.id) || {},
  [vuexTypes.accountBalanceByCode]: state =>
    code => state.balancesDetails
      .map(item => new BalanceRecord(item))
      .find(i => i.asset.code === code) || {},
  [vuexTypes.accountRoleId]: state => Number(get(state.account, 'role.id')),
  [vuexTypes.accountDepositAddresses]: state =>
    state.account.externalSystemIds || {},

  [vuexTypes.isAccountGeneral]: (_, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.generalRoleId,
  [vuexTypes.isAccountUsAccredited]: (_, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.usAccreditedRoleId,
  [vuexTypes.isAccountUsVerified]: (_, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.usVerifiedRoleId,
  [vuexTypes.isAccountCorporate]: (_, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.corporateRoleId,
  [vuexTypes.isAccountUnverified]: (_, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.unverifiedRoleId,
  [vuexTypes.isAccountBlocked]: (_, getters) =>
    getters[vuexTypes.accountRoleId] === keyValues.blockedRoleId,

  [vuexTypes.accountKycRecoveryStatus]: state =>
    get(state.account, 'kycRecoveryStatus.value', 0),

  [vuexTypes.isAccountKycRecoveryInProgress]: (_, getters) => {
    const state = getters[vuexTypes.accountKycRecoveryStatus]
    if (!state) return false
    return Object.values(ACCOUNT_KYC_RECOVERY_STATES).includes(state)
  },
  [vuexTypes.isAccountKycRecoveryInitiated]: (_, getters) => {
    const state = getters[vuexTypes.accountKycRecoveryStatus]
    return state === ACCOUNT_KYC_RECOVERY_STATES.initiated
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
