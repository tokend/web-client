import { vuexTypes } from '@/vuex/types'

const config = Object.freeze({
  STORAGE_KEY: 'TokenDStore-v2',
})

export const sessionStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    switch (mutation.type) {
      case vuexTypes.CLEAR_STATE: {
        sessionStorage.removeItem(config.STORAGE_KEY)
        break
      }
      case vuexTypes.POP_STATE: {
        let savedStore = sessionStorage.getItem(config.STORAGE_KEY)

        if (!savedStore) {
          break
        }

        savedStore = JSON.parse(savedStore)

        store.replaceState({
          ...state,
          account: savedStore.account,
          wallet: savedStore.wallet,
          kyc: savedStore.kyc,
          keyValue: savedStore.keyValue,
        })

        break
      }
      default:
        sessionStorage.setItem(config.STORAGE_KEY, JSON.stringify({
          account: state.account,
          wallet: state.wallet,
          kyc: state.kyc,
          keyValue: state.keyValue,
        }))
    }
  })
}
