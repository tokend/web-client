// import { vuexTypes } from '@/vuex/types'
// TODO: tmp using old types until the migration to new modules complete
import { vuexTypes as LVuexTypes } from 'L@/vuex/types'

const config = Object.freeze({
  STORAGE_KEY: 'TokenDStore-v2',
  CLEAR_ON_MUTATIONS: [LVuexTypes.SET_LOGGED_OUT_STATE],
  RESTORE_ON_MUTATIONS: [LVuexTypes.POP_STATE],
  DONT_SAVE_ON_MUTATIONS: [LVuexTypes.KEEP_SESSION]
})

export const sessionStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    if (config.DONT_SAVE_ON_MUTATIONS.includes(mutation.type)) {
      return
    }

    if (config.CLEAR_ON_MUTATIONS.includes(mutation.type)) {
      sessionStorage.removeItem(config.STORAGE_KEY)
      return
    }

    if (config.RESTORE_ON_MUTATIONS.includes(mutation.type)) {
      let savedStore = sessionStorage.getItem(config.STORAGE_KEY)

      if (!savedStore) {
        return
      }

      savedStore = JSON.parse(savedStore)

      store.replaceState({
        ...state,
        'new-account': savedStore['new-account'],
        'new-wallet': savedStore['new-wallet']
      })

      return
    }

    sessionStorage.setItem(config.STORAGE_KEY, JSON.stringify({
      'new-account': state['new-account'],
      'new-wallet': state['new-wallet']
    }))
  })
}
