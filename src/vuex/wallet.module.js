import { walletsManager, useWallet, api } from '@/api'

import { vuexTypes } from './types'
import { Wallet, encryptSecretSeed, decryptSecretSeed } from '@tokend/js-sdk'

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
      email: wallet.email,
      id: wallet.id,
      sessionId: wallet.sessionId,
      publicKey: wallet.keypair.accountId(),
    }
  },

  [vuexTypes.SET_ENCRYPTED_SECRET_SEED] (state, { secretSeed, sessionKey }) {
    const encryptedSecretSeed = encryptSecretSeed(
      secretSeed,
      sessionKey
    )
    state.wallet.encryptedSecretSeed = encryptedSecretSeed
  },
}

export const actions = {
  async [vuexTypes.LOAD_WALLET] ({ commit }, { email, password }) {
    const wallet = await walletsManager.get(email, password)
    useWallet(wallet)
    commit(vuexTypes.SET_WALLET, wallet)
    commit(vuexTypes.SET_ENCRYPTED_SECRET_SEED, {
      secretSeed: wallet.secretSeed,
      sessionKey: wallet.sessionKey,
    })
  },

  async [vuexTypes.STORE_WALLET] ({ commit }, wallet) {
    const newWallet = new Wallet(
      wallet.email,
      wallet.secretSeed,
      wallet.accountId,
      wallet.id,
      wallet.sessionId,
      wallet.sessionKey
    )
    useWallet(newWallet)
    commit(vuexTypes.SET_WALLET, newWallet)
    commit(vuexTypes.SET_ENCRYPTED_SECRET_SEED, {
      secretSeed: newWallet.secretSeed,
      sessionKey: newWallet.sessionKey,
    })
  },

  async [vuexTypes.DECRYPT_SECRET_SEED] ({ commit, getters, dispatch }) {
    const encryptedSecretSeed = getters[vuexTypes.encryptedSecretSeed]
    const session = await dispatch(vuexTypes.GET_SESSION)
    const decryptedSecretSeed = decryptSecretSeed(
      encryptedSecretSeed,
      session.encryptionKey
    )
    return decryptedSecretSeed
  },

  async [vuexTypes.GET_SESSION] ({ commit, getters }) {
    const sessionId = getters[vuexTypes.sessionId]
    const { data: session } = await api.get(`/sessions/${sessionId}`)
    return session
  },

  async [vuexTypes.PROLONGATE_SESSION] ({ dispatch }) {
    // we use GET_SESSION action here because we have only one endpoint for
    // prolongate and get session
    await dispatch(vuexTypes.GET_SESSION)
  },
}

export const getters = {
  [vuexTypes.walletId]: state => state.wallet.id,
  [vuexTypes.walletAccountId]: state => state.wallet.accountId,
  [vuexTypes.walletEmail]: state => state.wallet.email,
  [vuexTypes.sessionId]: state => state.wallet.sessionId,
  [vuexTypes.encryptedSecretSeed]: state => state.wallet.encryptedSecretSeed,
  [vuexTypes.walletPublicKey]: state => state.wallet.publicKey,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
