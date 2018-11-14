import { RecordFactory } from '../records/factory'
import { ErrorFactory, errorTypes } from '../errors/factory'
import store from '../../vuex/index'

export function parseTransaction (transaction, asset) {
  switch (transaction.type_i) {
    case 1:
      return RecordFactory.createTransferRecord(
        transaction, store.getters.accountId
      )
    case 3:
      return RecordFactory.createIssuanceRecord(
        transaction, store.getters.accountId
      )
    case 7:
      return RecordFactory.createWithdrawRecord(transaction)
    case 20:
      return RecordFactory.createMatchRecord(transaction, asset)
    case 16:
      return RecordFactory.createMatchRecord(transaction, asset)
    case 23:
      return RecordFactory.createTransferV2Record(
        transaction, store.getters.accountId
      )
    default:
      ErrorFactory.throwError(errorTypes.UnknownTransactionError)
  }
}
