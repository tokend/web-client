import { walletService } from '../../js/services/wallet.service'
import { WalletHelper } from '../../js/helpers/wallet.helper'
import { vuexTypes } from '../types'

import { Sdk } from '@/sdk'
import { Wallet } from '@tokend/js-sdk'

export const state = {
  id: ''
}

export const mutations = {
  SET_WALLET_ID (state, walletId) {
    state.id = walletId
  }
}

export const actions = {
  async PROCESS_USER_WALLET ({ dispatch }, credentials) {
    const kdf = await walletService.loadKdfParamsForEmail(credentials.email)
    const { walletId, walletKey } = WalletHelper.calculateWalletParams(
      credentials.password,
      credentials.email,
      kdf.attributes().salt,
      kdf.attributes()
    )
    const wallet = await walletService.loadWallet(walletId)
    dispatch(
      vuexTypes.STORE_USER_DATA_FROM_WALLET,
      WalletHelper.deriveUserDataFromWallet(wallet, walletKey)
    )
  },

  STORE_USER_DATA_FROM_WALLET ({ commit }, userData) {
    commit(vuexTypes.SET_WALLET_ID, userData.walletId)
    commit(vuexTypes.SET_USER_EMAIL, userData.email)
    commit(vuexTypes.SET_ACCOUNT_KEYS, {
      accountId: userData.accountId,
      publicKey: userData.publicKey,
      seed: userData.seed
    })
    Sdk.sdk.useWallet(new Wallet(
      userData.email,
      userData.seed,
      userData.accountId,
      userData.walletId
    ))
  }
}

export const getters = {
  walletId: state => state.id
}

export default {
  state,
  actions,
  getters,
  mutations
}
