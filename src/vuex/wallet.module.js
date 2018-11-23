import { vuexTypes } from './types'
import { Sdk } from '../sdk'

export const state = {
  wallet: {}
}

export const mutations = {
  [vuexTypes.SET_WALLET] (state, wallet) {
    state.wallet = wallet
  }
}

export const actions = {
  async [vuexTypes.LOAD_WALLET] ({ commit }, { email, password }) {
    commit(vuexTypes.SET_WALLET, await Sdk.api.wallets.get(email, password))
  }
}

export const getters = {
  [vuexTypes.walletId]: state => state.wallet.id,
  [vuexTypes.walletEmail]: state => state.wallet.email,
  [vuexTypes.walletSeed]: state => state.wallet.secretSeed,
  [vuexTypes.walletKeypair]: state => state.wallet.keypair,
  [vuexTypes.walletPublicKey]: state => state.wallet.keypair
    ? state.wallet.keypair.accountId()
    : ''
}

export default {
  state,
  mutations,
  actions,
  getters
}
