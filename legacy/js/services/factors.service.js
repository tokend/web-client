import request from '../builders/request_builder/index'
import store from '../../vuex/index'

export const factorsService = {
  loadFactors () {
    return request.wallets()
      .walletId(store.getters.walletId)
      .factors()
      .sign(store.getters.accountKeypair)
      .get()
  },

  createFactor (type = 'totp', password) {
    const data = { type, password }

    return request.wallets()
      .walletId(store.getters.walletId)
      .factors()
      .data(data)
      .sign(store.getters.accountKeypair)
      .json()
      .post()
  },

  verifyFactor (id, token, otp, wallet) {
    const attributes = { token, otp }

    return request.wallets()
      .walletId(store.getters.walletId || wallet)
      .factorId(id)
      .verification()
      .attributes(attributes)
      .json()
      .put()
  },

  updateFactor (id, priority) {
    const attributes = { priority }

    return request.wallets()
      .walletId(store.getters.walletId)
      .factorId(id)
      .attributes(attributes)
      .sign(store.getters.accountKeypair)
      .json()
      .patch()
  },

  deleteFactor (id, password) {
    const data = { password }
    return request.wallets()
      .walletId(store.getters.walletId)
      .factorId(id)
      .data(data)
      .sign(store.getters.accountKeypair)
      .delete()
  }
}
