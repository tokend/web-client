import walletUtil from '@tokend/wallet.js'
import { Keypair } from 'tokend-js-sdk'

export class WalletHelper {
  /**
   * Calculates wallet id + wallet key for provided params
   *
   * @param password
   * @param email
   * @param salt
   * @param kdfParams
   *
   * @return {object} walletParams
   *         {string} walletParams.walletId - unique identifier of user's wallet
   *         {ArrayBuffer} walletParams.walletKey - wallet key used
   *         later/previously to encrypt keychain data
   */
  static calculateWalletParams (password, email, salt, kdfParams) {
    return walletUtil.calculateWalletParams(...arguments)
  }

  /**
   * Decrypts keychain data with provided wallet key
   *
   * @param {string} encryptedKeychainData - keychain data to decrypt
   * @param {ArrayBuffer} walletKey - wallet key used when encrypting keychain
   * @return {object} keychainData - decrypted keychain data
   *         {string} keychainData.accountId - user account id
             {string} keychainData.seed - user seed
   */
  static decryptKeychainData (encryptedKeychainData, walletKey) {
    return walletUtil.decryptKeychainData(...arguments)
  }

  /**
   * Generates random keychain data for a new user
   *
   * @return {{rawKeychainData: string, accountId}}
   */
  static getRandomKeychainData () {
    const keys = Keypair.random()
    const rawKeychainData = JSON.stringify({
      seed: keys.secret(),
      accountId: keys.accountId()
    })
    const accountId = keys.accountId()
    return { rawKeychainData, accountId }
  }

  /**
   * NEED DOC
   * Generates data which later will be needed for recovery
   *
   * @param recoverySeed
   * @param email
   * @param kdfParams
   * @param rawKeychainData
   * @param accountId
   * @return {object}
   */
  static getRandomRecoveryAttributes (
    recoverySeed,
    email,
    kdfParams,
    rawKeychainData,
    accountId
  ) {
    return walletUtil.generateRecoveryData(...arguments)
  }

  /**
   * NEED DOC
   * Generates data which later will be needed for 2fa
   *
   * @param password
   * @param email
   * @param kdfAttributes
   * @return {object}
   */
  static getRandomFactorAttributes (password, email, kdfAttributes) {
    return walletUtil.generateFactorData(...arguments)
  }

  /**
   * NEED DOC
   * Generates data which later will be needed for sign-in
   *
   * @param password
   * @param email
   * @param kdfAttributes
   * @param rawKeychainData
   * @param accountId
   * @return {{
   *    id: string,
   *    attributes: {
   *      account_id: string,
   *      email: string,
   *      salt: string,
   *      keychain_data: string
   *    }
   * }}
   */
  static getRandomWalletAttributes (
    password,
    email,
    kdfAttributes,
    rawKeychainData,
    accountId
  ) {
    return walletUtil.generateWalletData(...arguments)
  }

  /**
   * NEED DOC
   * Signs token
   *
   * @param token
   * @param encryptedKeychain
   * @param key
   * @return {*}
   */
  static signToken (token, encryptedKeychain, key) {
    const keychainData = this.decryptKeychainData(encryptedKeychain, key)
    const data = token
    const rawKeypair = Keypair.fromSecret(keychainData.seed)
    const keypair = Keypair.fromRawSeed(rawKeypair._secretSeed)

    const signed = keypair.sign(data)
    return _arrayBufferToBase64(signed)
  }

  /**
   * NEED DOC
   * @param wallet
   * @param walletKey
   * @return {*}
   */
  static deriveUserDataFromWallet (wallet, walletKey) {
    const walletId = wallet.data('id')
    const encryptedKeychainData = wallet.attribute('keychain_data')
    const accountId = wallet.attribute('account_id')
    const email = wallet.attribute('email')
    const keychainData = this.decryptKeychainData(
      encryptedKeychainData,
      walletKey
    )
    const publicKey = keychainData.accountId
    const seed = keychainData.seed
    return {
      walletId,
      accountId,
      email,
      keychainData,
      publicKey,
      seed
    }
  }
}

function _arrayBufferToBase64 (buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
