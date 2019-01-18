import { OpRecord } from '../op-record'
import _get from 'lodash/get'
import { globalize } from '@/vue/filters/globalize'

export class IssuanceRecord extends OpRecord {
  constructor (record, accountId) {
    super(record)

    this.amount = record.amount
    this.asset = record.asset
    this.feeAsset = record.asset
    this.fixedFee = record.feeFixed
    this.percentFee = record.feePercent
    this.name = globalize('record-names.issuance')
    this.id = record.id
    this.subject = record.reference
    this.date = record.ledgerCloseTime
    this.accountId = accountId

    this.externalDetails = record.externalDetails

    this.blockNumber = _get(record, 'externalDetails.blockNumber')
    this.outIndex = _get(record, 'externalDetails.outIndex')
    this.txHash = _get(record, 'externalDetails.txHash')
  }

  get isIncoming () {
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
