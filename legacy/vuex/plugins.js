import { vuexTypes } from './types'
import { STORAGE_KEY } from './state/config'

function isSessionStorageSupported () {
  const testKey = 'test'
  const storage = window.sessionStorage
  try {
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

const sessionStoragePlugin = store => {
  if (!isSessionStorageSupported()) return

  store.subscribe((mutation, state) => {
    if (mutation.type === vuexTypes.SET_LOGGED_OUT_STATE) {
      sessionStorage.removeItem(STORAGE_KEY)
      sessionStorage.clear()
      return
    }
    const forSave = {
      auth: state.auth,
      account: state.account,
      user: state.user,
      wallet: state.wallet
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(forSave))
  })
}

export default [sessionStoragePlugin]
