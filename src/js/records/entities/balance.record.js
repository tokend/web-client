import { AssetRecord } from './asset.record'
import safeGet from 'lodash/get'
import config from '@/config'

export class BalanceRecord {
  constructor (record = {}) {
    this._record = record

    this.id = record.id
    this.asset = new AssetRecord(record.asset)

    let availableBalance = safeGet(record, 'state.available')
    this.balance = (+availableBalance)
      ? String(Math.floor(parseFloat(availableBalance) * 100) / 100)
      : parseFloat(availableBalance).toFixed(config.DECIMAL_POINTS)

    this.convertedBalance = record.convertedBalance
  }
}
