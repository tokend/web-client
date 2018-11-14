import { OpRecord } from '../op-record'
import { MathUtil } from '../../utils'

const STATES = {
  canceled: 'canceled',
  pending: 'pending'
}

export class ManageOfferRecord extends OpRecord {
  constructor (record, details) {
    super(record)

    this.asset = details.asset
    this.balanceId = details.balanceId
    this.accountId = details.accountId
    this.participants = record.participants

    this.isBuy = record.isBuy
    this.amount = MathUtil.add(record.amount, record.price)
    this.price = record.price
    this.fee = record.fee
    this.offerI = record.offerI
    this.orderBookId = record.orderBookId
    this.isDeleted = record.isDeleted
    this.baseAsset = record.baseAsset
    this.counterparty = this.baseAsset
  }

  get isIncoming () {
    // cancelling offer results in returning funds back to owner
    return this.state === STATES.canceled
  }
}
