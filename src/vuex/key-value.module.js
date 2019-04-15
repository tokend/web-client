import { vuexTypes } from '@/vuex/types'
import { Api } from '@/api'
import { ASSET_POLICIES } from '@tokend/js-sdk'

const KEY_VALUE_ENTRY_KEYS = Object.freeze({
  general: 'account_role:general',
  corporate: 'account_role:corporate',
  unverified: 'account_role:unverified',
})

export const state = {
  defaultRoleIds: {
    general: null,
    corporate: null,
    unverified: null,
  },
  kvAssetTypeKycRequired: null,
  defaultQuoteAsset: null,
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
  [vuexTypes.SET_KV_KYC_REQUIRED] (state, kvAssetTypeKycRequired) {
    state.kvAssetTypeKycRequired = kvAssetTypeKycRequired
  },
  [vuexTypes.SET_DEFAULT_QUOTE_ASSET] (state, asset) {
    state.defaultQuoteAsset = asset
  },
}

export const actions = {
  async [vuexTypes.LOAD_KV_ENTRIES] ({ dispatch }) {
    await dispatch(vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS)
    await dispatch(vuexTypes.LOAD_KV_KYC_REQUIRED)
  },

  async [vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS] ({ commit }) {
    const { data } = await Api.api.get('/v3/key_values')
    const [generalRoleId, corporateRoleId, unverifiedRoleId] = [
      getRole(KEY_VALUE_ENTRY_KEYS.general),
      getRole(KEY_VALUE_ENTRY_KEYS.corporate),
      getRole(KEY_VALUE_ENTRY_KEYS.unverified),
    ]

    function getRole (roleId) {
      const role = data.find((key) => key.id === roleId)
      return role.value.u32
    }

    commit(vuexTypes.SET_KV_ENTRY_GENERAL_ROLE_ID, generalRoleId)
    commit(vuexTypes.SET_KV_ENTRY_CORPORATE_ROLE_ID, corporateRoleId)
    commit(vuexTypes.SET_KV_ENTRY_UNVERIFIED_ROLE_ID, unverifiedRoleId)
  },
  async [vuexTypes.LOAD_KV_KYC_REQUIRED] ({ commit }) {
    const { data } = await Api.api.get('/v3/key_values/asset_type:kyc_required')
    commit(vuexTypes.SET_KV_KYC_REQUIRED, data.value.u32)
  },
  async [vuexTypes.LOAD_DEFAULT_QUOTE_ASSET] ({ commit }) {
    const { data } = await Api.getWithSignature('assets', {
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
  [vuexTypes.kvAssetTypeKycRequired]: state => state.kvAssetTypeKycRequired,
  [vuexTypes.defaultQuoteAsset]: state => state.defaultQuoteAsset,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
