import { base } from '@tokend/js-sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'

/** @param {OfferRecord} offer */
export function buildOpCancel (offer) {
  const ops = {
    offerID: offer.id,
    baseBalance: offer.baseBalanceId,
    quoteBalance: offer.quoteBalanceId,
    price: offer.price,
    orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
  }
  return base.ManageOfferBuilder.cancelOffer(ops)
}
