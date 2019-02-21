import { vuexTypes } from '@/vuex/types'
import { Api } from '@/api'

const KEY_VALUE_ENTRY_KEYS = Object.freeze({
  general: 'account_role:general',
  corporate: 'account_role:corporate',
})

const state = {
  defaultRoleIds: {
    general: null,
    corporate: null,
  },
}

const mutations = {
  [vuexTypes.SET_KV_ENTRY_GENERAL_ROLE_ID] (state, id) {
    state.defaultRoleIds.general = id
  },

  [vuexTypes.SET_KV_ENTRY_CORPORATE_ROLE_ID] (state, id) {
    state.defaultRoleIds.corporate = id
  },
}

const actions = {
  async [vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS] ({ commit }) {
    const [generalRoleId, corporateRoleId] = await Promise.all([
      loadRole(KEY_VALUE_ENTRY_KEYS.general),
      loadRole(KEY_VALUE_ENTRY_KEYS.corporate),
    ])

    commit(vuexTypes.SET_KV_ENTRY_GENERAL_ROLE_ID, generalRoleId)
    commit(vuexTypes.SET_KV_ENTRY_CORPORATE_ROLE_ID, corporateRoleId)

    async function loadRole (keyValueEntryKey) {
      const { data } = await Api.get(`key_values/${keyValueEntryKey}`)
      return data.value.u32
    }
  },
}

const getters = {
  [vuexTypes.kvEntryGeneralRoleId]: state => state.defaultRoleIds.general,
  [vuexTypes.kvEntryCorporateRoleId]: state => state.defaultRoleIds.corporate,
}

export default {
  ...state,
  ...mutations,
  ...actions,
  ...getters,
}
