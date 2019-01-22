import { OpRecord } from '../op-record'
import _get from 'lodash/get'

export class IssuanceRecord extends OpRecord {
  constructor (record, detailsOrAccountId) {
    super(record)
    this.id = record.id
    this.amount = record.amount
    this.asset = record.asset
    this.feeAsset = record.asset
    this.fixedFee = record.feeFixed
    this.percentFee = record.feePercent
    this.subject = record.reference
    this.date = record.ledgerCloseTime

    // TODO: fix (merge conflict quick fix)
    if (typeof detailsOrAccountId === 'string') {
      this.accountId = detailsOrAccountId
    } else if (typeof detailsOrAccountId === 'object') {
      this.accountId = detailsOrAccountId.accountId
    } else {
      this.accountId = ''
    }

    this.externalDetails = record.externalDetails

    this.blockNumber = _get(record, 'externalDetails.blockNumber')
    this.outIndex = _get(record, 'externalDetails.outIndex')
    this.txHash = _get(record, 'externalDetails.txHash')
  }

  get isIncoming () {
    // issuance operation it always operation for adding asset
    return true
  }

  get counterparty () {
    let participant = this._record.participants
      .find(p => p.accountId !== this.accountId)
    if (!participant) {
      participant = this._record.participants.find(p => !p.balanceId)
    }
    return _get(participant, 'accountId')
  }
}
