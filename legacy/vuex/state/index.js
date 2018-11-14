import initialState from './initial_state'
import * as config from './config'

function createState () {
  const state = initialState()
  const oldStateJSON = sessionStorage.getItem(config.STORAGE_KEY)
  if (oldStateJSON) {
    const oldState = JSON.parse(oldStateJSON)
    state.auth = oldState.auth || state.auth
    state.account = oldState.account || state.account
    state.user = oldState.user || state.user
    state.wallet = oldState.wallet || state.wallet
  }
  return state
}

export const state = createState()
