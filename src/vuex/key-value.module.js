import { vuexTypes } from '@/vuex/types'
import { Api } from '@/api'

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
}

export const actions = {
  async [vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS] ({ commit }) {
    const [generalRoleId, corporateRoleId, unverifiedRoleId] = await Promise
      .all([
        loadRole(KEY_VALUE_ENTRY_KEYS.general),
        loadRole(KEY_VALUE_ENTRY_KEYS.corporate),
        loadRole(KEY_VALUE_ENTRY_KEYS.unverified),
      ])

    commit(vuexTypes.SET_KV_ENTRY_GENERAL_ROLE_ID, generalRoleId)
    commit(vuexTypes.SET_KV_ENTRY_CORPORATE_ROLE_ID, corporateRoleId)
    commit(vuexTypes.SET_KV_ENTRY_UNVERIFIED_ROLE_ID, unverifiedRoleId)

    async function loadRole (keyValueEntryKey) {
      const { data } = await Api.api.get(`/v3/key_values/${keyValueEntryKey}`)
      return String(data.value.u32)
    }
  },
}

export const getters = {
  [vuexTypes.kvEntryGeneralRoleId]: state => state.defaultRoleIds.general,
  [vuexTypes.kvEntryCorporateRoleId]: state => state.defaultRoleIds.corporate,
  [vuexTypes.kvEntryUnverifiedRoleId]: state => state.defaultRoleIds.unverified,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
