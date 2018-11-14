import { Service } from './service'
import { Keypair } from 'tokend-js-sdk'

export class WalletService extends Service {
  /**
   * Loads wallet details by id
   *
   * @param {string} id - wallet id
   * @return {ResponseBuilder}
   */
  loadWallet (id) {
    return this._apiRequestBuilder.wallets()
      .walletId(id)
      .get()
  }

  /**
   * Creates user wallet
   *
   * @param walletAttributes
   * @param kdfData
   * @param factorAttributes
   * @param recoveryAttributes
   * @return {ResponseBuilder}
   */
  // TODO: write proper detailed doc
  createWallet (
    walletAttributes,
    kdfData,
    factorAttributes,
    recoveryAttributes
  ) {
    const kdf = { data: { type: kdfData.type, id: kdfData.id } }
    return this._apiRequestBuilder.wallets()
      .data(walletAttributes)
      .type('wallet')
      .relationship('kdf', kdf)
      .relationship('factor', factorAttributes)
      .relationship('recovery', recoveryAttributes)
      .json()
      .post()
  }

  /**
   * Updates wallet for recovery or change password ops
   *
   * @param {object} opts
   * @param {object} opts.transactionAttributes
   * @param {object} opts.walletAttributes
   * @param {object} opts.kdfAttributes
   * @param {object} opts.factorAttributes
   * @param {object} [opts.recoveryWalletId]
   * @param {object} [opts.recoverySeed]
   */
  updateWallet (opts) {
    const recoveryWalletId = opts.recoveryWalletId
    const recoverySeed = opts.recoverySeed
    const transactionAttributes = opts.transactionAttributes
    const walletAttributes = opts.walletAttributes
    const currentPassword = opts.currentPassword
    const factorAttributes = opts.factorAttributes
    const kdfAttributes = opts.kdfAttributes
    const kdf = { data: { type: kdfAttributes.type, id: kdfAttributes.id } }

    const keypair = recoverySeed
      ? Keypair.fromSecret(recoverySeed)
      : this._keypair
    const walletId = recoveryWalletId || this._walletId

    return this._apiRequestBuilder
      .wallets()
      .walletId(walletId)
      .data(walletAttributes)
      .trashConfig(currentPassword)
      .type('wallet')
      .relationship('transaction', transactionAttributes)
      .relationship('kdf', kdf)
      .relationship('factor', factorAttributes)
      .sign(keypair)
      .json()
      .put()
  }

  /**
   * Loads default Kdf params
   * @return {Promise<ResponseBuilder>}
   */
  loadDefaultKdfParams () {
    return this._apiRequestBuilder
      .kdf()
      .get()
  }

  /**
   * Loads kdf params for specified email
   *
   * @param email
   * @param isRecovery
   * @return {Promise<ResponseBuilder>}
   */
  loadKdfParamsForEmail (email, isRecovery = false) {
    return this._apiRequestBuilder
      .kdf()
      .forEmail(email)
      .isRecovery(isRecovery)
      .get()
  }
}

export const walletService = new WalletService()
