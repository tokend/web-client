import { Former } from './Former'
import { FEE_TYPES, base } from '@tokend/js-sdk'
import { calculateFees } from '@/js/helpers/invest-helper'
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
        assetCode: '',
        amount: '0',
        fees: {},
        balance: {},
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

    buildOpCancelOffer () {
      const op = base.ManageOfferBuilder.cancelOffer(
        this._getOfferOpts(
          this.attrs.currentInvestmentId,
          this.attrs.CANCEL_OFFER_FEE
        )
      )
      return op
    }

    _getOfferOpts (id, offerFee) {
      const balance = this.attrs.balance
      const attrs = this.attrs

      return {
        offerID: id,
        baseBalance: balance
          .find(balance => balance.asset.code === attrs.sale.baseAsset).id,
        quoteBalance: balance
          .find(balance => balance.asset.code === attrs.assetCode).id,
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
    }

    async calculateFees (accountId) {
      const response = await calculateFees({
        assetCode: this.attrs.assetCode,
        amount: this.attrs.amount || 0,
        senderAccountId: accountId,
        type: FEE_TYPES.investFee,
      })
      this.attrs.fees = response.totalFee.calculatedPercent

      return response
    }

    buildOpCreateBalance (assetCode, accountId) {
      const operation = base.Operation.manageBalance({
        destination: accountId,
        asset: assetCode,
        action: base.xdr.ManageBalanceAction.createUnique(),
      })
      return operation
    }
}
