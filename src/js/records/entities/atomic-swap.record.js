import _get from 'lodash/get'
import { store, vuexTypes } from '@/vuex/index'

export class AtomicSwapRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.ownerId = _get(record, 'owner')
    this.amount = _get(record, 'baseAmount')
    this.baseAsset = _get(record, 'baseAsset')
    this.baseAssetName = store.getters[vuexTypes.assetByCode](this.baseAsset)
      .name
    this.price = _get(record, 'price')

    this.quoteAssets = _get(record, 'paymentMethods', [])
      .map(item => ({
        id: item.asset,
        destination: _get(item, 'destination') || '',
      }))
  }
}
