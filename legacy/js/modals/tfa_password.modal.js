import common from '../services/common/common'
import { Keypair } from 'tokend-js-sdk'

export function signToken (token, encryptedKeychain, key) {
  const keychainData = common.decryptKeychainData(encryptedKeychain, key)
  const data = token
  const rawKeypair = Keypair.fromSecret(keychainData.seed)
  const keypair = Keypair.fromRawSeed(rawKeypair._secretSeed)

  const signed = keypair.sign(data)
  return _arrayBufferToBase64(signed)
}

export function _arrayBufferToBase64 (buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
