import { store, vuexTypes } from '@/vuex/index'

export class BusinessAssetRecord {
  constructor (record, holders) {
    this._record = record

    this.owner = record.owner.id
    this.asset = store.getters[vuexTypes.assetByCode](record.id)
    this.holders = holders.holders[record.id]
  }
}
