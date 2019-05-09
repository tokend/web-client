import config from '@/config'
import { initApi, walletsManager } from '@/api'

import { vuexTypes } from './types'
import { Wallet } from '@tokend/js-sdk'

export const state = {
  wallet: {},
}

export const mutations = {
  /**
   * @param state
   * @param wallet - valid instance of {Wallet} from {tokend/js-sdk}
   */
  [vuexTypes.SET_WALLET] (state, wallet) {
    if (!(wallet instanceof Wallet)) {
      throw new Error('Wallet should be an instance of sdk/wallet')
    }
    // FIXME All the fields we're copying from wallet are getters here and are
    //  not being properly serialized. Can be resolved later after implementing
    //  custom toJSON in the sdk Wallet class
    state.wallet = {
      accountId: wallet.accountId,
      secretSeed: wallet.secretSeed,
      email: wallet.email,
      id: wallet.id,
    }
  },
}

export const actions = {
  async [vuexTypes.LOAD_WALLET] ({ commit }, { email, password }) {
    const wallet = await walletsManager().get(email, password)
    await initApi(wallet, config.HORIZON_SERVER)
    commit(vuexTypes.SET_WALLET, wallet)
  },
  async [vuexTypes.STORE_WALLET] ({ commit }, wallet) {
    const newWallet = new Wallet(
      wallet.email,
      wallet.secretSeed,
      wallet.accountId,
      wallet.id
    )
    await initApi(newWallet, config.HORIZON_SERVER)
    commit(vuexTypes.SET_WALLET, wallet)
  },
}

export const getters = {
  [vuexTypes.walletId]: (state, getters) => state.wallet.id,
  [vuexTypes.walletAccountId]: (state, getters) => state.wallet.accountId,
  [vuexTypes.walletEmail]: (state, getters) => state.wallet.email,
  [vuexTypes.walletSeed]: (state, getters) =>
    state.wallet.secretSeed,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
