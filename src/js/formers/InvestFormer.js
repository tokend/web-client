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
        accountId: '',
        assetCode: '',
        amount: '0',
        fees: {},
        balances: {},
        sale: {},
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
        destination: this.attrs.accountId,
        asset: this.attrs.sale.baseAsset,
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
      const balances = this.attrs.balances
      const attrs = this.attrs
      const operation = {
        offerID: id,
        baseBalance: balances
          .find(item => item.asset.code === attrs.sale.baseAsset).id,
        quoteBalance: balances
          .find(item => item.asset.code === attrs.assetCode).id,
        isBuy: true,
        amount: MathUtil.divide(
          attrs.amount,
          attrs.sale.quoteAssetPrices[attrs.assetCode] ||
          INVEST_OFFERS.defaultQuotePrice,
          1
        ),
        price: attrs.sale.quoteAssetPrices[attrs.assetCode] ||
          INVEST_OFFERS.defaultQuotePrice,
        fee: offerFee,
        orderBookID: attrs.sale.id,
      }
      return operation
    }

    async calculateFees () {
      const response = await calculateFees({
        assetCode: this.attrs.assetCode,
        amount: this.attrs.amount || 0,
        senderAccountId: this.attrs.accountId,
        type: FEE_TYPES.investFee,
      })
      this.attrs.fees = response.totalFee.calculatedPercent

      return response
    }
}
