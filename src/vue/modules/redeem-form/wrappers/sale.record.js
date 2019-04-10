import _get from 'lodash/get'

export class SaleRecord {
  constructor (record) {
    this._record = record

    this.baseAsset = _get(record, 'baseAsset')
    this.defaultQuoteAsset = _get(record, 'defaultQuoteAsset')
    this.quoteAssets = _get(record, 'quoteAssets') || []
  }
}
