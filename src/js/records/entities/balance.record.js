import { AssetRecord } from './asset.record'
import safeGet from 'lodash/get'

export class BalanceRecord {
  constructor (record = {}) {
    this._record = record

    this.id = record.id
    this.balance = safeGet(record, 'state.available')
    this.convertedBalance = record.convertedBalance

    this.assetDetails = new AssetRecord(record.asset)
    this.asset = this.assetDetails.code
  }
}
