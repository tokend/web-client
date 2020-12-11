import { Former } from './Former'
import { FEE_TYPES, base } from '@tokend/js-sdk'
import { calculateFees } from '@/js/helpers/fees-helper'
import { MathUtil } from '@/js/utils'
import { INVEST_OFFERS } from '@/js/const/invest-offers'

/**
 * Collects the attributes for invest operations
 * @class
 * @implements {Former}
 */
export class InvestFormer extends Former {
    attrs = this.attrs || this._defaultAttrs

    get _defaultAttrs () {
      return {
        senderAccountId: '',
        investedAssetCode: '',
        amount: '0',
        fees: {},
        baseBalanceId: '',
        quoteBalanceId: '',
        saleId: '',
        saleBaseAsset: '',
        saleQuoteAssetPrices: '',
        currentInvestmentId: '',
      }
    }

    buildOps () {
      let operations = []

      if (this.attrs.currentInvestmentId) {
        operations.push(this.buildOpCancelOffer())
      }

      operations.push(base.ManageOfferBuilder.manageOffer(
        this._getOfferOpts(
          INVEST_OFFERS.createId,
          this.attrs.fees)
      ))

      return operations
    }

    buildOpCreateBalance () {
      const operation = base.Operation.manageBalance({
        destination: this.attrs.senderAccountId,
        asset: this.attrs.saleBaseAsset,
        action: base.xdr.ManageBalanceAction.createUnique(),
      })
      return operation
    }

    buildOpCancelOffer () {
      const operation = base.ManageOfferBuilder.cancelOffer(
        this._getOfferOpts(
          this.attrs.currentInvestmentId,
          INVEST_OFFERS.cancelFee
        )
      )
      return operation
    }

    _getOfferOpts (id, offerFee) {
      const attrs = this.attrs
      const opts = {
        offerID: id,
        baseBalance: attrs.baseBalanceId,
        quoteBalance: attrs.quoteBalanceId,
        isBuy: true,
        amount: MathUtil.divide(
          attrs.amount,
          attrs.saleQuoteAssetPrices ||
          INVEST_OFFERS.defaultQuotePrice,
          1
        ),
        price: attrs.saleQuoteAssetPrices ||
          INVEST_OFFERS.defaultQuotePrice,
        fee: offerFee,
        orderBookID: attrs.saleId,
      }
      return opts
    }

    async calculateFees () {
      const response = await calculateFees({
        assetCode: this.attrs.investedAssetCode,
        amount: this.attrs.amount || 0,
        senderAccountId: this.attrs.senderAccountId,
        type: FEE_TYPES.investFee,
      })
      this.attrs.fees = response.totalFee.calculatedPercent

      return response
    }
}
