import { MathUtil } from '@/js/utils'

/**
 * Manage offer is an operation that locks funds once account places an offer
 * and once when the offer is matched
 */
export class ManageOfferOp {
  constructor (record) {
    this.orderBookId = record.orderBookId
    this.baseAmount = record.baseAmount
    this.isDeleted = record.isDeleted
    this.offerId = record.offerId
    this.price = record.price
    this.isBuy = record.isBuy

    this.baseAssetCode = record.baseAsset.id
    this.quoteAssetCode = record.quoteAsset.id
  }

  get quoteAmount () {
    return MathUtil.multiply(this.baseAmount, this.price)
  }
}
