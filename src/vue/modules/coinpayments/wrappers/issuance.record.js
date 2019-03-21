import _get from 'lodash/get'

const TRANSACTION_TIME_MARGIN = 600 // seconds

export class IssuanceRecord {
  constructor (record) {
    this.id = record.id
    this.txId = _get(record, 'requestDetails.creatorDetails.txnId')
    this.amount = _get(record, 'requestDetails.amount')
    this.asset = _get(record, 'requestDetails.asset.id')
    this.date = _get(record, 'createdAt')
    this.timeout = _get(record, 'requestDetails.creatorDetails.timeout')
    this.address = _get(record, 'requestDetails.creatorDetails.address')

    this.endTime = this._calculateEndTime()
  }

  _calculateEndTime () {
    return +new Date(this.date) + (this.timeout * 1000) -
      TRANSACTION_TIME_MARGIN
  }
}
