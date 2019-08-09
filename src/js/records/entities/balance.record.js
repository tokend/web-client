import { AssetRecord } from './asset.record'
import safeGet from 'lodash/get'

import { amountToPrecision } from '@/js/helpers/amount'

export class BalanceRecord {
  constructor (record = {}, precision) {
    this._record = record

    this.id = record.id
    this.asset = new AssetRecord(record.balance.asset)

    this.balance =
      amountToPrecision(safeGet(record, 'balance.state.available'), precision)

    this.isConverted = record.isConverted
    this.convertedBalance = record.convertedAmounts
  }
}
