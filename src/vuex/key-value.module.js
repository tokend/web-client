import { vuexTypes } from '@/vuex/types'
import { api } from '@/api'

const KV_PAGE_LIMIT = 50

function getKvValue (kvKey, kvArray) {
  const kvFound = kvArray.find((key) => key.id === kvKey)

  if (!kvFound) {
    return ''
  }

  return kvFound.value.u32
}

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
  kvDefaultSignerRoleId: '',
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
  [vuexTypes.SET_KV_DEFAULT_SIGNER_ROLE_ID] (state, kvDefaultSignerRoleId) {
    state.kvDefaultSignerRoleId = kvDefaultSignerRoleId
  },
}

export const actions = {
  async [vuexTypes.LOAD_KV_ENTRIES] ({ dispatch }) {
    await dispatch(vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS)
  },

  async [vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS] ({ commit }) {
    const { data } = await api.get(`/v3/key_values`, {
      page: { limit: KV_PAGE_LIMIT },
    })

    const generalRoleId = getKvValue('account_role:general', data)
    const corporateRoleId = getKvValue('account_role:corporate', data)
    const unverifiedRoleId = getKvValue('account_role:unverified', data)
    const blockedRoleId = getKvValue('account_role:blocked', data)
    const usVerifiedRoleId = getKvValue('account_role:us_verified', data)
    const usAccreditedRoleId = getKvValue('account_role:us_accredited', data)
    const assetTypeKycRequired = getKvValue('asset_type:kyc_required', data)
    const assetTypeSecurity = getKvValue('asset_type:security', data)
    const defaultSignerRoleId = getKvValue('signer_role:default', data)

    commit(vuexTypes.SET_KV_ENTRY_GENERAL_ROLE_ID, generalRoleId)
    commit(vuexTypes.SET_KV_ENTRY_CORPORATE_ROLE_ID, corporateRoleId)
    commit(vuexTypes.SET_KV_ENTRY_UNVERIFIED_ROLE_ID, unverifiedRoleId)
    commit(vuexTypes.SET_KV_ENTRY_BLOCKED_ROLE_ID, blockedRoleId)
    commit(vuexTypes.SET_KV_ENTRY_US_VERIFIED_ROLE_ID, usVerifiedRoleId)
    commit(vuexTypes.SET_KV_ENTRY_US_ACCREDITED_ROLE_ID, usAccreditedRoleId)
    commit(vuexTypes.SET_KV_KYC_REQUIRED, assetTypeKycRequired)
    commit(vuexTypes.SET_KV_ASSET_TYPE_SECURITY, assetTypeSecurity)
    commit(vuexTypes.SET_KV_DEFAULT_SIGNER_ROLE_ID, defaultSignerRoleId)
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
  [vuexTypes.defaultQuoteAsset]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.statsQuoteAsset].code,
  [vuexTypes.kvDefaultSignerRoleId]: state => state.kvDefaultSignerRoleId,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
