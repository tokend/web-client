import { OpRecord } from '../op-record'
import { MathUtil } from '../../utils'

const STATES = {
  canceled: 'canceled',
  pending: 'pending',
}

export class ManageOfferRecord extends OpRecord {
  constructor (record, details) {
    super(record)

    this.balanceId = details.balanceId
    this.accountId = details.accountId
    this.baseAsset = details.baseAsset
    this.quoteAsset = details.quoteAsset

    this.participants = record.participants
    this.isBuy = record.isBuy
    this.baseAmount = record.amount
    this.amount = MathUtil.multiply(record.amount, record.price)
    this.price = record.price
    this.fee = record.fee
    this.offerI = record.offerI
    this.orderBookId = record.orderBookId
    this.isDeleted = record.isDeleted
    this.counterparty = this.baseAsset
  }

  get isIncoming () {
    // cancelling offer results in returning funds back to owner
    return this.state === STATES.canceled
  }
}
