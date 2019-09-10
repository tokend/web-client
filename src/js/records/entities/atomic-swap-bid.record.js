import _get from 'lodash/get'
import moment from 'moment'
const TRANSACTION_TIME_MARGIN = 600 // seconds

export class AtomicSwapBidRecord {
  constructor (record) {
    this.id = record.id
    this.createdAt = record.createdAt || ''
    this.address = _get(record, 'externalDetails.data[0].address') ||
      _get(record, 'data.address')
    this.amount = _get(record, 'externalDetails.data[0].amount') ||
      _get(record, 'data.amount')
    this.quoteAssetCode = _get(record, 'externalDetails.data[0].asset')
    this.timeout = _get(record, 'externalDetails.data[0].timeout') ||
      _get(record, 'data.timeout')
    this.endTime = this._calculateEndTime()
    this.requestIdentifier = _get(record, 'requestDetails.creatorDetails.requestIdentifier')
    this.type = _get(record, 'type') || ''
    this.payUrl = _get(record, 'data.payUrl') || ''
  }

  _calculateEndTime () {
    // eslint-disable-next-line max-len
    return moment(this.createdAt).unix() + this.timeout - TRANSACTION_TIME_MARGIN
  }
}
