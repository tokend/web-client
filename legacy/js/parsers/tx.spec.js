import { parseTransaction } from './tx.parser'
import {
  withdawRecord,
  transferRecord,
  issuanceRecord
} from '../../../test/unit/mock_data/records'

import { WithdrawalRecord } from '../records/withdrawal.record'
import { TransferRecord } from '../records/transfer.record'
import { IssuanceRecord } from '../records/issuance.record'

import { ErrorFactory, errorTypes } from '../errors/factory'

import { UnknownTransactionError } from '../errors/unknown_transaction.error'

describe('correctly parses transactions', () => {
  it ('should correctly define transfer entity', () => {
     expect(parseTransaction(transferRecord).constructor).to.equal(TransferRecord)
  })

  it ('should correctly define issuance entity', () => {
     expect(parseTransaction(issuanceRecord).constructor).to.equal(IssuanceRecord)
  })

  it ('UnknownTransactionError constructor should be a UnknownTransactionError', () => {
    const newInstance = new UnknownTransactionError()
    expect(newInstance.constructor).to.equal(UnknownTransactionError)
  })

  it ('UnknownTransactionError constructor should be a UnknownTransactionError', () => {
    expect(ErrorFactory.throwError(errorTypes.UnknownTransactionError).constructor).to.throw(UnknownTransactionError)
  })
})
