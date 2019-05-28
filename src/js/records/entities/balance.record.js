import { AssetRecord } from './asset.record'
import safeGet from 'lodash/get'

export class BalanceRecord {
  constructor (record = {}) {
    this._record = record

    this.id = record.id
    this.asset = new AssetRecord(record.asset)

    this.balance = safeGet(record, 'state.available')
    this.convertedBalance = record.convertedBalance
  }
}
