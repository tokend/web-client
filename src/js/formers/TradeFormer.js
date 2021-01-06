import { Former } from './Former'
import { calculateFees } from '@/js/helpers/fees-helper'
import { getAssetBalanceId } from '@/js/helpers/trade-helper'
import { FEE_TYPES, base } from '@tokend/js-sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { api } from '@/api'

/**
 * Collects the attributes for trade operations
 * @class
 * @implements {Former}
 */
export class TradeFormer extends Former {
    attrs = this.attrs || this._defaultAttrs
    get _defaultAttrs () {
      return {
        pricePerOneItem: '',
        isBuy: false,
        pair: {
          baseAsset: {},
          quoteAsset: {},
        },
        baseAmount: '',
        quoteAmount: '',
        creatorAccountId: '',
        fees: {
          totalFee: '',
        },
        accountBalances: [],
      }
    }

    async buildOpsUpdate (offer) {
      const cancelOperation = this.buildOpsCancel(offer)
      const createOperation = await this.buildOpsCreate()
      await api.postOperations(cancelOperation, createOperation)
    }

    /**
     * @param {Object} offer
     * @param {String} offer.id - offer id
     * @param {Object} offer.baseBalance.id - balance id of the base asset
     * @param {String} offer.quoteBalance.id - balance id of the quote asset
     * @param {String} offer.price - offer price for one item
     * @returns {Object} operation cancel offer
     */
    buildOpsCancel (offer) {
      const ops = {
        offerID: offer.id,
        baseBalance: offer.baseBalance.id,
        quoteBalance: offer.quoteBalance.id,
        price: offer.price,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
      }
      return base.ManageOfferBuilder.cancelOffer(ops)
    }

    async buildOpsCreate () {
      const ops = {
        amount: this.attrs.baseAmount,
        price: this.attrs.pricePerOneItem,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        isBuy: this.attrs.isBuy,
        baseBalance: getAssetBalanceId(
          this.attrs.pair.baseAsset.code,
          this.attrs.accountBalances
        ).id,
        quoteBalance: getAssetBalanceId(
          this.attrs.pair.quoteAsset.code,
          this.attrs.accountBalances
        ).id,
        fee: this.attrs.fees.totalFee.calculatedPercent,
      }
      return base.ManageOfferBuilder.manageOffer(ops)
    }

    async calculateFees () {
      const response = await calculateFees({
        assetCode: this.attrs.pair.quoteAsset.code,
        amount: this.attrs.quoteAmount || 0,
        senderAccountId: this.attrs.creatorAccountId,
        type: FEE_TYPES.offerFee,
      })
      this.attrs.fees.totalFee = response.totalFee

      return response
    }

    /**
     *
     * @param {Object} source
     * @param {String} price: price per one item
     * @param {String} baseAmount: base amount
     * @param {String} quoteAmount: quote amount
     * @param {String} defaultQuoteAsset: cap asset code
     * @param {String} baseAsset.id: baset asset id
     * @param {String} quoteAsset.id: quote asset id
     * @param {Boolean} isBuy: is buy or not
     * @param {String} fee: fees
     */
    populate (source) {
      this.attrs = this._defaultAttrs

      this.attrs.pricePerOneItem = source.price
      this.attrs.baseAmount = source.baseAmount
      this.attrs.quoteAmount = source.quoteAmount
      this.attrs.pair.baseAsset.code = source.baseAsset.id
      this.attrs.pair.quoteAsset.code = source.quoteAsset.id
      this.attrs.isBuy = source.isBuy
      this.attrs.fees.totalFee = source.fee
    }
}
