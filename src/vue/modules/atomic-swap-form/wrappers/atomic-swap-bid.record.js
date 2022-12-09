import _get from 'lodash/get'
import { DateUtil } from '@/js/utils'
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
    // eslint-disable-next-line max-len
    return DateUtil.toTimestamp(this.date) + this.timeout - TRANSACTION_TIME_MARGIN
  }
}
