import { Keypair } from 'tokend-js-sdk'
import { TxHelper } from '../helpers/tx.helper'
import { walletService, WalletService } from './wallet.service'
import { WalletHelper } from '../helpers/wallet.helper'

export class AuthService extends WalletService {
  /**
   * Sign up user to the system
   *
   * @async
   *
   * @param credentials
   * @param credentials.email
   * @param credentials.password
   * @param recoveryKeypair - random keypair containing recovery seed.
   *        IMPORTANT: User will need to copy this seed to make account
   *        recovery possible. Seed itself is NOT being stored anywhere, so
   *        user should know he has the only possibility to save it
   * @returns {string} walletId - wallet id of created wallet
   */
  async signup (credentials, recoveryKeypair) {
    const kdf = await walletService.loadDefaultKdfParams()

    const { rawKeychainData, accountId } = WalletHelper.getRandomKeychainData()

    const walletAttributes = WalletHelper.getRandomWalletAttributes(
      credentials.password,
      credentials.email,
      kdf.attributes(),
      rawKeychainData,
      accountId
    )

    const factorAttributes = await WalletHelper.getRandomFactorAttributes(
      credentials.password,
      credentials.email,
      kdf.attributes()
    )

    const recoveryAttributes = await WalletHelper.getRandomRecoveryAttributes(
      recoveryKeypair.secret(),
      credentials.email,
      kdf.attributes(),
      rawKeychainData,
      recoveryKeypair.accountId()
    )

    const wallet =
      await this.createWallet(
        walletAttributes,
        kdf.data(),
        factorAttributes,
        recoveryAttributes
      )
    return wallet.data('id')
  }

  /**
   * Changes users password
   *
   * @async
   * @param {object} opts
   * @param {string} opts.email
   * @param {string} opts.newPassword
   * @param opts
   * @return {Promise<object>} newKeys
   */
  async changePassword (opts) {
    const email = opts.email
    const newPassword = opts.newPassword
    const newKeypair = Keypair.random()
    const currentPassword = opts.currentPassword
    const envelope = await TxHelper.createChangePasswordTx({
      signerPublicKey: this._publicKey,
      accountId: this._accountId,
      oldKeypair: this._keypair,
      newKeypair
    })

    const kdf = await this.loadDefaultKdfParams()
    const options = this._composeOptions({
      kdf,
      envelope,
      newKeypair,
      newPassword,
      email,
      currentPassword
    })
    await this.updateWallet(options)

    return {
      newSeed: newKeypair.seed(),
      newPublicKey: newKeypair.accountId(),
      newWalletId: options.walletAttributes.id
    }
  }

  /**
   * Makes account recovery
   *
   * @async
   * @param {object} opts
   * @param {string} opts.recoverySeed
   * @param {string} opts.email
   * @param {string} opts.newPassword
   * @return {Promise<void>}
   */
  async makeRecovery (opts) {
    const recoverySeed = opts.recoverySeed
    const newPassword = opts.newPassword
    const email = opts.email
    const newKeypair = Keypair.random()
    const kdf = await this.loadKdfParamsForEmail(email, true)

    const walletParams = WalletHelper.calculateWalletParams(recoverySeed,
      email,
      kdf.attributes().salt,
      kdf.attributes()
    )

    const recoveryWalletId = walletParams.walletId
    const wallet = await this.loadWallet(recoveryWalletId)
    const envelope = await TxHelper.createRecoveryTx({
      accountId: wallet.attribute('account_id'),
      recoverySeed,
      newKeypair
    })

    const options = this._composeOptions({
      newPassword,
      newKeypair,
      envelope,
      email,
      kdf
    })

    await this.updateWallet({
      ...options,
      recoveryWalletId,
      recoverySeed
    })
  }

  /**
   * @param {object} opts
   * @param {ResponseBuilder} opts.kdf
   * @param {string} opts.envelope
   * @param {} opts.newKeypair
   * @param {string} opts.newPassword
   * @param {string} opts.email
   * @return {object}
   */
  _composeOptions (opts) {
    const kdf = opts.kdf
    const envelope = opts.envelope
    const keypair = opts.newKeypair
    const newPassword = opts.newPassword
    const email = opts.email
    const currentPassword = opts.currentPassword

    const keychainData = {
      seed: keypair.secret(),
      accountId: keypair.accountId()
    }
    const transactionAttributes = { data: { attributes: { envelope } } }
    const kdfAttributes = kdf.data()

    const walletAttributes = WalletHelper.getRandomWalletAttributes(
      newPassword,
      email,
      kdf.attributes(),
      JSON.stringify(keychainData),
      keychainData.accountId
    )

    const factorAttributes = WalletHelper.getRandomFactorAttributes(
      newPassword,
      email,
      kdf.attributes()
    )

    return {
      factorAttributes,
      kdfAttributes,
      transactionAttributes,
      walletAttributes,
      currentPassword
    }
  }
}

export const authService = new AuthService()
