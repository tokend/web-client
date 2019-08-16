import _get from 'lodash/get'
import camelCase from 'lodash/camelCase'

export class AtomicSwapRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.ownerId = _get(record, 'owner.id')
    this.availableAmount = _get(record, 'availableAmount')
    this.createdAt = _get(record, 'createdAt')
    this.isCanceled = _get(record, 'isCanceled')
    this.lockedAmount = _get(record, 'lockedAmount')
    this.baseAsset = _get(record, 'baseBalance.asset.id')
    this.baseAssetName = _get(record, 'baseBalance.asset.details.name')

    this.quoteAssets = _get(record, 'quoteAssets', [])
      .map(item => ({
        id: item.quoteAsset,
        price: item.price,
        // we use camelCase because js-sdk parse response data keys in camelCase
        address: _get(record, `details.addresses[${camelCase(item.id)}]`),
      }))
  }
}
