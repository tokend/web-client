import {
  Keypair,
  TransactionBuilder,
  SetOptionsBuilder
} from 'tokend-js-sdk'
import { defaultSignerParams } from '../const/const'
import { initHorizonServer } from './server.helper'
import { parseError } from '../parsers/error.parser'
import { errors } from '../errors/factory'
import get from 'lodash/get'

export class TxHelper {
  /**
   * @param opts.
   * @param opts.newKeypair
   * @param opts.recoverySeed
   * @param opts.accountId
   * @return {Promise<string>} transactionEnvelope
   */
  static createRecoveryTx (opts) {
    const newKeypair = opts.newKeypair
    const recoveryKeypair = Keypair.fromSecret(opts.recoverySeed)
    const accountId = opts.accountId

    return this._createReplaceSignerTransaction({
      keypairToSign: recoveryKeypair,
      signerToReplace: null,
      newKeypair,
      accountId
    })
  }

  /**
   * @param opts
   * @param opts.newKeypair
   * @param opts.oldKeypair
   * @param opts.accountId
   * @param opts.signerPublicKey
   * @return {Promise<string>} transactionEnvelope
   */
  static createChangePasswordTx (opts) {
    const newKeypair = opts.newKeypair
    const oldKeypair = opts.oldKeypair
    const accountId = opts.accountId
    const signerToReplace = opts.signerPublicKey

    return this._createReplaceSignerTransaction({
      keypairToSign: oldKeypair,
      signerToReplace,
      newKeypair,
      accountId
    })
  }

  /**
   * @param opts
   * @param opts.newKeypair
   * @param opts.accountId
   * @param opts.signerToReplace
   * @param opts.keypairToSign
   * @return {Promise<string>}
   * @private
   */
  static async _createReplaceSignerTransaction (opts) {
    const newKeypair = opts.newKeypair
    const accountId = opts.accountId
    const keypairToSign = opts.keypairToSign
    const signerToReplace = opts.signerToReplace

    let signers
    let operations

    try {
      signers = get(await this._loadAccountSigners(accountId), 'signers')
      operations = [
        this._addSignerOp(newKeypair.accountId()),
        ...(
          signerToReplace
            ? this._removeMasterAndCurrentSignerOps(
              signers,
              accountId,
              signerToReplace
            )
            : this._removeAllSignersOps(signers, accountId)
        )
      ]
    } catch (error) {
      switch (parseError(error).constructor) {
        case errors.NotFoundError:
          operations = [
            this._addSignerOp(newKeypair.accountId()),
            this._removeMasterOp()
          ]
          break
        default:
          throw new Error(error)
      }
    }

    const tx = new TransactionBuilder(this._createFakeAccountStruct(accountId))
    tx.operations = operations
    const txEnv = tx.build()
    txEnv.sign(keypairToSign)
    return txEnv.toEnvelope().toXDR().toString('base64')
  }

  static _removeMasterAndCurrentSignerOps (signers, accountId, publicKey) {
    return signers
      .filter(signer =>
        signer.public_key !== accountId && signer.public_key !== publicKey
      )
      .map(signer =>
        isMaster(signer, accountId)
          ? this._removeMasterOp()
          : this._removeOneSignerOp(signer)
      )

    function isMaster (signer, masterAccountId) {
      return signer.public_key === masterAccountId
    }
  }

  static _removeAllSignersOps (signers, accountId) {
    return signers
      .map(signer =>
        isMaster(signer, accountId)
          ? this._removeMasterOp()
          : this._removeOneSignerOp(signer)
      )

    function isMaster (signer, masterAccountId) {
      return signer.public_key === masterAccountId
    }
  }

  static _removeMasterOp () {
    return SetOptionsBuilder.setOptions({
      masterWeight: 0
    })
  }

  static _removeOneSignerOp (signer) {
    return SetOptionsBuilder.setOptions({
      signer: {
        pubKey: signer.public_key,
        weight: 0,
        identity: signer.signer_identity,
        signerType: 1
      }
    })
  }

  static _addSignerOp (newAccountId) {
    return SetOptionsBuilder.setOptions({
      signer: {
        ...defaultSignerParams,
        pubKey: newAccountId
      }
    })
  }

  static _loadAccountSigners (id) {
    const server = initHorizonServer()
    return server.accounts()
      .signers(id)
      .call()
  }

  static _createFakeAccountStruct (id) {
    return {
      accountId () {
        return id
      }
    }
  }
}
