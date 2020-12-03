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
        price: '',
        amount: '0',
        assetCode: '',
        isBuy: false,
        assetPair: {},
        quoteAmount: '',
        accountId: '',
        fees: {
          totalFee: '',
        },
        accountBalances: [],
        offerId: '',
      }
    }

    // async buildOpsUpdate () {
    // }

    // async buildOpsCancel () {
    // }

    async buildOpsCreate () {
      await this.createAssetPairBalances({
        pair: {
          base: this.attrs.asset,
          quote: this.attrs.assetPair.quote,
        },
      })
      //   console.log('buildOpsCreate')
      const a = {
        amount: this.attrs.amount,
        price: this.attrs.price,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        isBuy: this.attrs.isBuy,
        baseBalance: this.getAssetDetails(this.attrs.assetCode).id,
        quoteBalance: this.getAssetDetails(this.attrs.assetPair.quote).id,
        fee: this.attrs.fees.totalFee.calculatedPercent,
      }
      //   console.log('former create', this.attrs)
      return base.ManageOfferBuilder.manageOffer(a)
    }

    getAssetDetails (assetCode) {
    //   console.log('assetCode', assetCode)
      return this.attrs.accountBalances.find(i => i.asset.code === assetCode)
    }

    async createAssetPairBalances () {
      if (!this.getAssetDetails(this.attrs.assetPair.base)) {
        const operation = base.Operation.manageBalance({
          destination: this.attrs.accountId,
          asset: this.attrs.assetPair.base,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
        await api.postOperations(operation)
        // await this.loadBalances()
      }

      if (!this.getAssetDetails(this.attrs.assetPair.quote)) {
        const operation = base.Operation.manageBalance({
          destination: this.attrs.accountId,
          asset: this.attrs.assetPair.quote,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
        await api.postOperations(operation)
        // await this.loadBalances()
      }
    }

    async calculateFees () {
      const response = await calculateFees({
        assetCode: this.attrs.assetPair.quote,
        amount: this.attrs.quoteAmount || 0,
        senderAccountId: this.attrs.accountId,
        type: FEE_TYPES.offerFee,
      })
      return response
    }
}
