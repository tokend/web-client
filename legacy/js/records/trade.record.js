import { multiply } from '../utils/math.util'

export class TradeRecord {
  constructor (record) {
    this.baseAssetCode = record.base_asset
    this.quoteAssetCode = record.quote_asset
    this.baseAmount = record.base_amount
    this.price = record.price
    this.createdAt = record.created_at
  }

  get quoteAmount () {
    return multiply(this.baseAmount, this.price)
  }
}
