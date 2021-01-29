import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { store, vuexTypes } from '@/vuex'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'

export async function createBalanceIfNotExists (assetCode) {
  if (!getBalanceId(assetCode)) {
    const operation = base.Operation.manageBalance({
      destination: store.getters[vuexTypes.accountId],
      asset: assetCode,
      action: base.xdr.ManageBalanceAction.createUnique(),
    })
    await api.postOperations(operation)
  }
}

export function getBalanceId (assetCode) {
  let balance = store.getters[vuexTypes.accountBalances]
    .find(i => i.asset.code === assetCode)

  if (!balance) {
    return
  }

  return balance.id
}

// /**
//  * @param {Object} offer
//  * @param {String} offer.id - offer id
//  * @param {Object} offer.baseBalance.id - balance id of the base asset
//  * @param {String} offer.quoteBalance.id - balance id of the quote asset
//  * @param {String} offer.price - offer price for one item
//  * @returns {Object} operation cancel offer
//  */
/** @param {KycGeneralRecord} offer */
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
