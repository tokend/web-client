import { Former } from './Former'
import { calculateFees } from '@/js/helpers/fees-helper'
import {
  getBalanceId,
  buildOpCancel,
} from '@/js/helpers/trade-helper'
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
        pair: {
          baseAssetCode: '',
          quoteAssetCode: '',
        },
        baseAmount: '',
        quoteAmount: '',
        creatorAccountId: '',
        fees: {
          totalFee: {},
        },
      }
    }

    async buildOpsCreate (offer) {
      let operations = []
      if (offer) {
        operations.push(buildOpCancel(offer))
      }

      const ops = {
        amount: this.attrs.baseAmount,
        price: String(+this.attrs.quoteAmount / +this.attrs.baseAmount),
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        isBuy: this.attrs.isBuy,
        baseBalance: getBalanceId(this.attrs.pair.baseAssetCode),
        quoteBalance: getBalanceId(this.attrs.pair.quoteAssetCode),
        fee: this.attrs.fees.totalFee.calculatedPercent,
      }
      operations.push(base.ManageOfferBuilder.manageOffer(ops))

      return operations
    }

    async calculateFees () {
      const response = await calculateFees({
        assetCode: this.attrs.pair.quoteAssetCode,
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
      this.attrs.pair.baseAssetCode = source.baseAsset.id
      this.attrs.pair.quoteAssetCode = source.quoteAsset.id
      this.attrs.isBuy = source.isBuy
      this.attrs.fees.totalFee = source.fee
    }
}
