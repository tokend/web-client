import { vuexTypes } from '@/vuex/types'
import { api } from '@/api'
import { ASSET_POLICIES } from '@tokend/js-sdk'

const KEY_VALUE_ENTRY_KEYS = Object.freeze({
  general: 'account_role:general',
  corporate: 'account_role:corporate',
  unverified: 'account_role:unverified',
  blocked: 'account_role:blocked',
  usVerified: 'account_role:us_verified',
  usAccredited: 'account_role:us_accredited',
})

export const state = {
  defaultRoleIds: {
    general: null,
    corporate: null,
    usVerified: null,
    usAccredited: null,
    unverified: null,
    blocked: null,
  },
  kvAssetTypeKycRequired: null,
  kvAssetTypeSecurity: null,
  defaultQuoteAsset: '',
}

export const mutations = {
  [vuexTypes.SET_KV_ENTRY_GENERAL_ROLE_ID] (state, id) {
    state.defaultRoleIds.general = id
  },

  [vuexTypes.SET_KV_ENTRY_CORPORATE_ROLE_ID] (state, id) {
    state.defaultRoleIds.corporate = id
  },

  [vuexTypes.SET_KV_ENTRY_US_VERIFIED_ROLE_ID] (state, id) {
    state.defaultRoleIds.usVerified = id
  },

  [vuexTypes.SET_KV_ENTRY_US_ACCREDITED_ROLE_ID] (state, id) {
    state.defaultRoleIds.usAccredited = id
  },

  [vuexTypes.SET_KV_ENTRY_UNVERIFIED_ROLE_ID] (state, id) {
    state.defaultRoleIds.unverified = id
  },

  [vuexTypes.SET_KV_ENTRY_BLOCKED_ROLE_ID] (state, id) {
    state.defaultRoleIds.blocked = id
  },

  [vuexTypes.SET_KV_KYC_REQUIRED] (state, kvAssetTypeKycRequired) {
    state.kvAssetTypeKycRequired = kvAssetTypeKycRequired
  },
  [vuexTypes.SET_KV_ASSET_TYPE_SECURITY] (state, kvAssetTypeSecurity) {
    state.kvAssetTypeSecurity = kvAssetTypeSecurity
  },
  [vuexTypes.SET_DEFAULT_QUOTE_ASSET] (state, asset) {
    state.defaultQuoteAsset = asset
  },
}

export const actions = {
  async [vuexTypes.LOAD_KV_ENTRIES] ({ dispatch }) {
    await dispatch(vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS)
    await dispatch(vuexTypes.LOAD_KV_KYC_REQUIRED)
    await dispatch(vuexTypes.LOAD_KV_ASSET_TYPE_SECURITY)
  },

  async [vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS] ({ commit }) {
    const { data } = await api().get(`/v3/key_values`)

    const generalRoleId = getRole(KEY_VALUE_ENTRY_KEYS.general)
    const corporateRoleId = getRole(KEY_VALUE_ENTRY_KEYS.corporate)
    const unverifiedRoleId = getRole(KEY_VALUE_ENTRY_KEYS.unverified)
    const blockedRoleId = getRole(KEY_VALUE_ENTRY_KEYS.blocked)
    const usVerifiedRoleId = getRole(KEY_VALUE_ENTRY_KEYS.usVerified)
    const usAccreditedRoleId = getRole(KEY_VALUE_ENTRY_KEYS.usAccredited)

    function getRole (roleId) {
      const role = data.find((key) => key.id === roleId)

      if (!role) {
        return ''
      }

      return role.value.u32
    }

    commit(vuexTypes.SET_KV_ENTRY_GENERAL_ROLE_ID, generalRoleId)
    commit(vuexTypes.SET_KV_ENTRY_CORPORATE_ROLE_ID, corporateRoleId)
    commit(vuexTypes.SET_KV_ENTRY_UNVERIFIED_ROLE_ID, unverifiedRoleId)
    commit(vuexTypes.SET_KV_ENTRY_BLOCKED_ROLE_ID, blockedRoleId)
    commit(vuexTypes.SET_KV_ENTRY_US_VERIFIED_ROLE_ID, usVerifiedRoleId)
    commit(vuexTypes.SET_KV_ENTRY_US_ACCREDITED_ROLE_ID, usAccreditedRoleId)
  },

  async [vuexTypes.LOAD_KV_KYC_REQUIRED] ({ commit }) {
    const { data } = await api().get('/v3/key_values/asset_type:kyc_required')
    commit(vuexTypes.SET_KV_KYC_REQUIRED, data.value.u32)
  },
  async [vuexTypes.LOAD_KV_ASSET_TYPE_SECURITY] ({ commit }) {
    const { data } = await api().get('/v3/key_values/asset_type:security')
    commit(vuexTypes.SET_KV_ASSET_TYPE_SECURITY, data.value.u32)
  },
  async [vuexTypes.LOAD_DEFAULT_QUOTE_ASSET] ({ commit }) {
    const { data } = await api().get('/v3/assets', {
      filter: {
        policy: ASSET_POLICIES.statsQuoteAsset,
      },
    })

    commit(vuexTypes.SET_DEFAULT_QUOTE_ASSET, data[0].id)
  },
}

export const getters = {
  [vuexTypes.kvEntryGeneralRoleId]: state => state.defaultRoleIds.general,
  [vuexTypes.kvEntryCorporateRoleId]: state => state.defaultRoleIds.corporate,
  [vuexTypes.kvEntryUnverifiedRoleId]: state => state.defaultRoleIds.unverified,
  [vuexTypes.kvEntryUsVerifiedRoleId]: state => state.defaultRoleIds.usVerified,
  [vuexTypes.kvEntryUsAccreditedRoleId]: state =>
    state.defaultRoleIds.usAccredited,
  [vuexTypes.kvEntryBlockedRoleId]: state => state.defaultRoleIds.blocked,
  [vuexTypes.kvAssetTypeKycRequired]: state => state.kvAssetTypeKycRequired,
  [vuexTypes.kvAssetTypeSecurity]: state => state.kvAssetTypeSecurity,
  [vuexTypes.defaultQuoteAsset]: state => state.defaultQuoteAsset,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
