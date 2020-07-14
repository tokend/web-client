import { keyValues } from '@/key-values'
import { getCurrentWalletPublicKey, getMasterAccId } from '@/js/helpers/api-helpers'
import { Signer } from '@tokend/js-sdk'

export function createNewAccountSigners () {
  const signers = []

  // NOTE: default signer is appended by the walletsManager

  if (keyValues.bridgesEnabled > 0) {
    const issuanceSigner = new Signer({
      id: getMasterAccId(),
      roleId: keyValues.issuanceSignerRoleId,
      weight: 1000,
      identity: 1,
    })
    signers.push(issuanceSigner)
  }
  return signers
}

export function createKycRecoverySigners () {
  const signers = []

  const defaultSignerOpts = {
    publicKey: getCurrentWalletPublicKey(),
    roleID: String(keyValues.defaultSignerRoleId),
    weight: '1000',
    identity: '1',
    details: {},
  }
  signers.push(defaultSignerOpts)

  if (keyValues.bridgesEnabled > 0) {
    const issuanceSignerOpts = {
      publicKey: getMasterAccId(),
      roleID: String(keyValues.issuanceSignerRoleId),
      weight: '1000',
      identity: '1',
      details: {},
    }
    signers.push(issuanceSignerOpts)
  }

  return signers
}
