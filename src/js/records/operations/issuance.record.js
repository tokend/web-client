import { OpRecord } from '../op-record'
import _get from 'lodash/get'

export class IssuanceRecord extends OpRecord {
  constructor (record) {
    super(record)
    this.id = record.id
    this.amount = record.amount
    this.asset = record.asset
    this.feeAsset = record.asset
    this.fixedFee = record.feeFixed
    this.percentFee = record.feePercent
    this.subject = record.reference

    this.externalDetails = record.externalDetails

    this.blockNumber = _get(record, 'externalDetails.blockNumber')
    this.outIndex = _get(record, 'externalDetails.outIndex')
    this.txHash = _get(record, 'externalDetails.txHash')
    this.typeI = record.typeI
    this.type = record.type
  }

  get isIncoming () {
    return true
  }

  get counterparty () {
    return _get(this._record.participants.find(p => !p.balanceId), 'accountId')
  }
}
