import safeGet from 'lodash/get'
export class OfferRecord {
  constructor (record = {}) {
    this._record = record
    this.baseAmount = record.baseAmount
    this.quoteAmount = record.quoteAmount
    this.createdAt = record.createdAt
    this.cumulativeBaseAmount = record.cumulativeBaseAmount
    this.cumulativeQuoteAmount = record.cumulativeQuoteAmount
    this.id = record.id
    this.isBuy = record.isBuy
    this.price = record.price
    this.baseAssetCode = safeGet(record, 'baseAsset.id', '')
    this.quoteAssetCode = safeGet(record, 'quoteAsset.id', '')
  }
}
