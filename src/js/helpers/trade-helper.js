import { base } from '@tokend/js-sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'

/**
 * @param {Object} offer
 * @param {String} offer.id - offer id
 * @param {Object} offer.baseBalance.id - balance id of the base asset
 * @param {String} offer.quoteBalance.id - balance id of the quote asset
 * @param {String} offer.price - offer price for one item
 * @returns {Object} operation cancel offer
 */
export function buildOpCancel (offer) {
  const ops = {
    offerID: offer.id,
    baseBalance: offer.baseBalance.id,
    quoteBalance: offer.quoteBalance.id,
    price: offer.price,
    orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
  }
  return base.ManageOfferBuilder.cancelOffer(ops)
}
