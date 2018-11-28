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
    switch (mutation.type) {
      case LVuexTypes.KEEP_SESSION:
        break
      case LVuexTypes.SET_LOGGED_OUT_STATE: {
        sessionStorage.removeItem(config.STORAGE_KEY)
        break
      }
      case LVuexTypes.POP_STATE: {
        let savedStore = sessionStorage.getItem(config.STORAGE_KEY)

        if (!savedStore) {
          break
        }

        savedStore = JSON.parse(savedStore)

        store.replaceState({
          ...state,
          'new-account': savedStore['new-account'],
          'new-wallet': savedStore['new-wallet']
        })

        break
      }
      default:
        sessionStorage.setItem(config.STORAGE_KEY, JSON.stringify({
          'new-account': state['new-account'],
          'new-wallet': state['new-wallet']
        }))
    }
  })
}
