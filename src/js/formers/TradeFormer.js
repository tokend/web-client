import { Former } from './Former'
import { calculateFees } from '@/js/helpers/fees-helper'
import { FEE_TYPES, base } from '@tokend/js-sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'

/**
 * Collects the attributes for trade operations
 * @class
 * @implements {Former}
 */
export class TradeFormer extends Former {
    attrs = this.attrs || this._defaultAttrs
    get _defaultAttrs () {
      return {
        isBuy: false,
        baseAssetCode: '',
        quoteAssetCode: '',
        baseAmount: '',
        quoteAmount: '',
        baseBalanceId: '',
        quoteBalanceId: '',
        creatorAccountId: '',
        fees: {},
      }
    }

    async buildOpCreate () {
      const operation = {
        amount: this.attrs.baseAmount,
        price: String(+this.attrs.quoteAmount / +this.attrs.baseAmount),
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        isBuy: this.attrs.isBuy,
        baseBalance: this.attrs.baseBalanceId,
        quoteBalance: this.attrs.quoteBalanceId,
        fee: this.attrs.fees.calculatedPercent,
      }
      return base.ManageOfferBuilder.manageOffer(operation)
    }

    async calculateFees () {
      const fee = await calculateFees({
        assetCode: this.attrs.quoteAssetCode,
        amount: this.attrs.quoteAmount || 0,
        senderAccountId: this.attrs.creatorAccountId,
        type: FEE_TYPES.offerFee,
      })
      this.attrs.fees = fee.totalFee
      return fee
    }

    /**
     *
     * @param {Object} source
     * @param {String} baseAmount: base amount
     * @param {String} quoteAmount: quote amount
     * @param {String} baseAsset.id: baset asset id
     * @param {String} quoteAsset.id: quote asset id
     * @param {Boolean} isBuy: is buy or not
     * @param {String} fee: fees
     */
    populate (source) {
      this.attrs = this._defaultAttrs

      this.attrs.baseAmount = source.baseAmount
      this.attrs.quoteAmount = source.quoteAmount
      this.attrs.baseAssetCode = source.baseAsset.id
      this.attrs.quoteAssetCode = source.quoteAsset.id
      this.attrs.isBuy = source.isBuy
      this.attrs.fees = source.fee
    }
}
