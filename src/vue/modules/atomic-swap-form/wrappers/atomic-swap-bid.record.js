import _get from 'lodash/get'

export class AtomicSwapBidRecord {
  constructor (record) {
    this.id = record.id
    this.createdAt = record.createdAt
    this.address = _get(record, 'externalDetails.data[0].invoice.address')
    this.amount = _get(record, 'externalDetails.data[0].invoice.amount')
    this.quoteAssetCode = _get(record, 'externalDetails.data[0].invoice.asset')
    this.endTime = 0
    this.requestIdentifier = _get(record, 'requestDetails.creatorDetails.requestIdentifier')
  }
}
