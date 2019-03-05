import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class WithdrawalDetailsRequestRecord extends RequestRecord {
  constructor (record) {
    super(record)
    this.amount = _get(record, 'details.createWithdraw.amount')
    this.fixedFee = _get(record, 'details.createWithdraw.fixed_fee')
    this.percentFee = _get(record, 'details.createWithdraw.percent_fee')
    this.address = _get(record, 'details.createWithdraw.externalDetails.address')
  }
}
