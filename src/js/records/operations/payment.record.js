import { OpRecord } from '../op-record'
import { MathUtil } from '../../utils/math.util'
import _get from 'lodash/get'

export class PaymentRecord extends OpRecord {
  /**
   * @param record - raw record from {@link HorizonResponse}
   * @param details
   * @param details.accountId
   */
  constructor (record, details = {}) {
    super(record)

    if (!details.accountId) {
      throw new Error(
        'The details.accountId is required to properly ' +
        'define the direction of the payment'
      )
    }

    this.accountId = details.accountId

    this.amount = record.amount
    this.asset = record.asset

    this.sourcePaysForDest = record.sourcePaysForDest
    this.sourceFeeAsset = _get(
      record, 'sourceFeeData.actualPaymentFeeAssetCode'
    )
    this.destinationFeeAsset = _get(
      record, 'destinationFeeData.actualPaymentFeeAssetCode'
    )

    this.participants = record.participants

    this.receiver = record.to
    this.sender = record.from
    this.subject = record.subject

    this.details = details
  }

  get isIncoming () {
    return this.sender === this.accountId
  }

  get counterparty () {
    return this.isIncoming ? this.sender : this.receiver
  }

  get fees () {
    return {
      source: MathUtil.add(
        _get(this._record, 'sourceFeeData.actualPaymentFee'),
        _get(this._record, 'sourceFeeData.fixedFee')),
      destination: MathUtil.add(
        _get(this._record, 'destinationFeeData.actualPaymentFee'),
        _get(this._record, 'destinationFeeData.fixedFee'))
    }
  }
}
