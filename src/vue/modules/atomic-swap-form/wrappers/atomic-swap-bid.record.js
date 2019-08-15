import _get from 'lodash/get'
import moment from 'moment'
const TRANSACTION_TIME_MARGIN = 600 // seconds

export class AtomicSwapBidRecord {
  constructor (record) {
    this.id = record.id
    this.createdAt = record.createdAt
    this.address = _get(record, 'externalDetails.data[0].invoice.address')
    this.amount = _get(record, 'externalDetails.data[0].invoice.amount')
    this.quoteAssetCode = _get(record, 'externalDetails.data[0].invoice.asset')
    this.endTime = this._calculateEndTime()
    this.timeout = _get(record, 'externalDetails.data[0].invoice.timeout')
    this.requestIdentifier = _get(record, 'requestDetails.creatorDetails.requestIdentifier')
  }

  _calculateEndTime () {
    return moment(this.date).unix() + this.timeout - TRANSACTION_TIME_MARGIN
  }
}
