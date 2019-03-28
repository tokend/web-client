import safeGet from 'lodash/get'
import { Request } from '../../shared/wrappers/request'

export class IncomingWithdrawalRequest extends Request {
  constructor (record) {
    super(record)

    this.requestor = safeGet(record, 'requestor.id')
    this.hash = record.hash
    this.pendingTasks = record.pendingTasks

    this.amount = safeGet(record, 'requestDetails.amount')
    this.fixedFee = safeGet(record, 'requestDetails.fee.fixed')
    this.percentFee = safeGet(record, 'requestDetails.fee.calculatedPercent')
    this.address = safeGet(record, 'requestDetails.creatorDetails.address')
    this.balanceId = safeGet(record, 'requestDetails.balance.id')
  }
}
