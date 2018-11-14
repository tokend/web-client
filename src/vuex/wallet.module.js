import { vuexTypes } from './types'
import { Sdk } from '../sdk'

export const state = {
  wallet: {}
}

export const mutations = {
  SET_WALLET (state, wallet) {
    state.wallet = wallet
  }
}

export const actions = {
  async LOAD_WALLET ({ commit }, { email, password }) {
    commit(vuexTypes.SET_WALLET, await Sdk.api.wallets.get(email, password))
  }
}

export const getters = {
  walletId: state => state.wallet.id,
  walletEmail: state => state.wallet.email,
  walletSeed: state => state.wallet.secretSeed,
  walletKeypair: state => state.wallet.keypair,
  walletPublicKey: state => state.wallet.keypair
    ? state.wallet.keypair.accountId()
    : ''
}

export default {
  state,
  mutations,
  actions,
  getters
}
