import safeGet from 'lodash/get'

import { MathUtil } from '@/js/utils'
import { RequestRecord } from '../request-record'
import { amountToPrecision } from '@/js/helpers/amount'

export class AtomicSwapRequestsRecord extends RequestRecord {
  constructor (record, baseAssetPrecision, quoteAssetPrecision) {
    super(record)
    this.amount = amountToPrecision(
      safeGet(record, 'requestDetails.baseAmount'),
      baseAssetPrecision
    )
    this.convertedAmount = amountToPrecision(
      MathUtil.multiply(this.amount, safeGet(record, 'requestDetails.quoteAsset.price')),
      quoteAssetPrecision)
    this.quoteAsset = safeGet(record, 'requestDetails.quoteAsset')
    this.buyerId = safeGet(record, 'requestor.id')
  }
}
