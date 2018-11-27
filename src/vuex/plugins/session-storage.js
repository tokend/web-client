// import { vuexTypes } from '@/vuex/types'
import { vuexTypes as LVuexTypes } from 'L@/vuex/types'

const config = Object.freeze({
  STORAGE_KEY: 'TokenDStore-v2',
  DONT_SAVE_ON_MUTATIONS: [LVuexTypes.KEEP_SESSION],
  TRUNCATE_ON_MUTATIONS: [LVuexTypes.SET_LOGGED_OUT_STATE],
  RESTORE_ON_MUTATIONS: [LVuexTypes.POP_STATE]
})

export const sessionStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    if (config.DONT_SAVE_ON_MUTATIONS.includes(mutation.type)) {
      return
    }

    if (config.TRUNCATE_ON_MUTATIONS.includes(mutation.type)) {
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
