import { Former } from './Former'
import { calculateFees } from '@/js/helpers/fees-helper'
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
          base: '',
          quote: '',
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
      await this.createAssetPairBalances()

      const ops = {
        amount: this.attrs.baseAmount,
        price: this.attrs.pricePerOneItem,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        isBuy: this.attrs.isBuy,
        baseBalance: this.getAssetDetails(this.attrs.pair.base).id,
        quoteBalance: this.getAssetDetails(this.attrs.pair.quote).id,
        fee: this.attrs.fees.totalFee.calculatedPercent,
      }

      return base.ManageOfferBuilder.manageOffer(ops)
    }

    /**
     *
     * @param {String} assetCode - asset code
     * @returns {Object} Balance record
     */
    getAssetDetails (assetCode) {
      return this.attrs.accountBalances.find(i => i.asset.code === assetCode)
    }

    async createAssetPairBalances () {
      if (!this.getAssetDetails(this.attrs.pair.base)) {
        const operation = base.Operation.manageBalance({
          destination: this.attrs.creatorAccountId,
          asset: this.attrs.pair.base,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
        await api.postOperations(operation)
      }

      if (!this.getAssetDetails(this.attrs.pair.quote)) {
        const operation = base.Operation.manageBalance({
          destination: this.attrs.creatorAccountId,
          asset: this.attrs.pair.quote,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
        await api.postOperations(operation)
      }
    }

    async calculateFees () {
      const response = await calculateFees({
        assetCode: this.attrs.pair.quote,
        amount: this.attrs.quoteAmount || 0,
        senderAccountId: this.attrs.creatorAccountId,
        type: FEE_TYPES.offerFee,
      })
      this.attrs.fees.totalFee = response.totalFee

      return response
    }

    populate (source) {
      this.attrs = this.attrs || this._defaultAttrs

      this.attrs.pricePerOneItem = source.price || ''
      this.attrs.baseAmount = source.baseAmount || ''
      this.attrs.quoteAmount = source.quoteAmount || ''
      this.attrs.pair.base = source.baseAsset.id || ''
      this.attrs.pair.quote = source.quoteAsset.id || ''
      this.attrs.isBuy = source.isBuy || false
      this.attrs.fees.totalFee = source.fee || ''
    }
}
