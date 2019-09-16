import _get from 'lodash/get'

export class CreateAtomicSwapRecord {
  constructor (record) {
    this._record = record

    this.assetCode = _get(record, 'asset.code') || _get(record, 'code')
    this.amount = _get(record, 'amount') || _get(record, 'amountToSell')
    this.price = _get(record, 'price')

    this.quoteAssets = _get(record, 'quoteAssets', [])
  }
}
