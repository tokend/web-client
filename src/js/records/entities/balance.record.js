import { AssetRecord } from './asset.record'
import safeGet from 'lodash/get'

import { amountToPrecision } from '@/js/helpers/amount'

export class BalanceRecord {
  constructor (record = {}, precision) {
    this._record = record

    this.id = record.id
    this.asset = new AssetRecord(record.asset)
    this.balance =
      amountToPrecision(safeGet(record, 'state.available'), precision)

    this.convertedBalance = record.convertedBalance
  }
}
