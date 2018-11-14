import { WalletHelper } from '../../js/helpers/wallet.helper'
import { vuexTypes } from '../types'
import common from '../../js/services/common/common'
import store from '../index'

export class AuthStateHelper {
  /**
   * Checks provided password is correct
   *
   * @param password
   * @return {Boolean}
   */
  static async isPasswordCorrect (password) {
    const email = store.getters[vuexTypes.userEmail]
    const targetWalletId = store.getters[vuexTypes.walletId]

    const kdf = await common.getWalletKDF(email)

    const { walletId } = WalletHelper.calculateWalletParams(
      password,
      email,
      kdf.attributes().salt,
      kdf.attributes()
    )
    return targetWalletId === walletId
  }
}
