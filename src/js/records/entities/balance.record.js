import { AssetRecord } from './asset.record'
import safeGet from 'lodash/get'
import config from '@/config'

export class BalanceRecord {
  constructor (record = {}, precision) {
    this._record = record

    this.id = record.id
    this.asset = new AssetRecord(record.balance.asset)

    this.balance =
      this.balanceToPrecision(safeGet(record, 'balance.state.available'), precision)
    this.isConverted = record.isConverted
    this.convertedBalance = record.convertedAmounts
  }

  balanceToPrecision (balance, precision = config.DECIMAL_POINTS) {
    const digits = Math.pow(10, precision)
    return (+balance)
      ? String(Math.floor(parseFloat(balance) * digits) / digits)
      : parseFloat(balance).toFixed(precision)
  }
}
