import { Former } from './Former'
import { FEE_TYPES, base } from '@tokend/js-sdk'
import { calculateFees } from '@/js/helpers/fees-helper'
import { MathUtil } from '@/js/utils'

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
        OFFER_CREATE_ID: '0',
        CANCEL_OFFER_FEE: '0',
        DEFAULT_QUOTE_PRICE: '1',
      }
    }

    buildOps () {
      let operations = []

      if (this.attrs.currentInvestmentId) {
        operations.push(this.buildOpCancelOffer())
      }

      operations.push(base.ManageOfferBuilder.manageOffer(
        this._getOfferOpts(
          this.attrs.OFFER_CREATE_ID,
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
          this.attrs.CANCEL_OFFER_FEE
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
          attrs.DEFAULT_QUOTE_PRICE,
          1
        ),
        price: attrs.sale.quoteAssetPrices[attrs.assetCode] ||
          attrs.DEFAULT_QUOTE_PRICE,
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
