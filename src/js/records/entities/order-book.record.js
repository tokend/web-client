import { OfferRecord } from './offer.record'
export class OrderBookRecord {
  constructor (record = {}) {
    this._record = record
    this.id = record.id
    this.baseAssetCode = record.baseAsset.id
    this.quoteAssetCode = record.quoteAsset.id
    this.buyEntries = record.buyEntries.map(i => new OfferRecord(i))
    this.sellEntries = record.sellEntries.map(i => new OfferRecord(i))
  }
}
