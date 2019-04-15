import { vuexTypes } from '@/vuex/types'
import { Api } from '@/api'

const KEY_VALUE_ENTRY_KEYS = Object.freeze({
  general: 'account_role:general',
  corporate: 'account_role:corporate',
  unverified: 'account_role:unverified',
  blocked: 'account_role:blocked',
})

export const state = {
  defaultRoleIds: {
    general: null,
    corporate: null,
    unverified: null,
    blocked: null,
  },
  kvAssetTypeKycRequired: null,
}

export const mutations = {
  [vuexTypes.SET_KV_ENTRY_GENERAL_ROLE_ID] (state, id) {
    state.defaultRoleIds.general = id
  },

  [vuexTypes.SET_KV_ENTRY_CORPORATE_ROLE_ID] (state, id) {
    state.defaultRoleIds.corporate = id
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
}

export const actions = {
  async [vuexTypes.LOAD_KV_ENTRIES] ({ dispatch }) {
    await dispatch(vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS)
    await dispatch(vuexTypes.LOAD_KV_KYC_REQUIRED)
  },

  async [vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS] ({ commit }) {
    const { data } = await Api.api.get(`/v3/key_values`)

    const generalRoleId = getRole(KEY_VALUE_ENTRY_KEYS.general)
    const corporateRoleId = getRole(KEY_VALUE_ENTRY_KEYS.corporate)
    const unverifiedRoleId = getRole(KEY_VALUE_ENTRY_KEYS.unverified)
    const blockedRoleId = getRole(KEY_VALUE_ENTRY_KEYS.blocked)

    function getRole (roleId) {
      const role = data.find((key) => key.id === roleId)
      return role.value.u32
    }

    commit(vuexTypes.SET_KV_ENTRY_GENERAL_ROLE_ID, generalRoleId)
    commit(vuexTypes.SET_KV_ENTRY_CORPORATE_ROLE_ID, corporateRoleId)
    commit(vuexTypes.SET_KV_ENTRY_UNVERIFIED_ROLE_ID, unverifiedRoleId)
    commit(vuexTypes.SET_KV_ENTRY_BLOCKED_ROLE_ID, blockedRoleId)
  },

  async [vuexTypes.LOAD_KV_KYC_REQUIRED] ({ commit }) {
    const { data } = await Api.api.get('/v3/key_values/asset_type:kyc_required')
    commit(vuexTypes.SET_KV_KYC_REQUIRED, data.value.u32)
  },
}

export const getters = {
  [vuexTypes.kvEntryGeneralRoleId]: state => state.defaultRoleIds.general,
  [vuexTypes.kvEntryCorporateRoleId]: state => state.defaultRoleIds.corporate,
  [vuexTypes.kvEntryUnverifiedRoleId]: state => state.defaultRoleIds.unverified,
  [vuexTypes.kvEntryBlockedRoleId]: state => state.defaultRoleIds.blocked,
  [vuexTypes.kvAssetTypeKycRequired]: state => state.kvAssetTypeKycRequired,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
