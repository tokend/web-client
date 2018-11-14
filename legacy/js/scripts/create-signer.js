import { Keypair } from 'tokend-js-sdk'
import { TxHelper } from '../helpers/tx.helper'
import { operationBuilder } from '../builders/operation_builder/operation_builder'

const adminSeed = 'SACWNGZAMCWRXZ4THU2JJ5FMCK7QTGQHQPTCNYZVSMZNZXZMOUWD5YT6'
const adminPk = 'GCUQOFCNZDI7TLFWCIAMYY5BXXBG3GLNCRU5FXKXXND4TMX7SCGZBKYV'

export async function addAdminSigner () {
  const keypair = Keypair.fromSecret(adminSeed)
  const signerAccountId = 'GBPHKB3BBTSO7F3UCBTQWL6IGIOBNBAC42ATNHBQD2U46VUEXIAJ6TWV'

  const op = TxHelper._addSignerOp(signerAccountId)

  await operationBuilder
    .operation()
    .add(op)
    .submit(adminPk, keypair)
}
