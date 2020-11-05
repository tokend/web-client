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
        OFFER_CREATE_ID: '0',
        CANCEL_OFFER_FEE: '0',
        DEFAULT_QUOTE_PRICE: '1',
      }
    }

    buildOps (currentInvestmentId, balance, sale, fees) {
      let operations = []
      if (currentInvestmentId) {
        operations.push(this._cancelOffer(currentInvestmentId, balance, sale))
      }

      operations.push(this._manageOffer(fees, balance, sale))
      return operations
    }

    _manageOffer (fees, balance, sale) {
      const op = base.ManageOfferBuilder.manageOffer(
        this._getOfferOpts(
          this.attrs.OFFER_CREATE_ID,
          fees,
          balance,
          sale)
      )
      return op
    }

    _cancelOffer (currentInvestmentId, balance, sale) {
      const op = base.ManageOfferBuilder.cancelOffer(
        this._getOfferOpts(
          String(currentInvestmentId),
          this.attrs.CANCEL_OFFER_FEE,
          balance,
          sale
        )
      )
      return op
    }

    cancelOffer (currentInvestmentId, balance, sale) {
      const op = this._cancelOffer(currentInvestmentId, balance, sale)
      return op
    }

    populate (source) {
      this.attrs = this.attrs || this._defaultAttrs

      this.attrs.assetCode = source.asset.code
      this.attrs.amount = source.amount
    }

    _getOfferOpts (id, offerFee, balances, sale) {
      const a = {
        offerID: id,
        baseBalance: balances
          .find(balance => balance.asset.code === sale.baseAsset).id,
        quoteBalance: balances
          .find(balance => balance.asset.code === this.attrs.assetCode).id,
        isBuy: true,
        amount: MathUtil.divide(
          this.attrs.amount,
          sale.quoteAssetPrices[this.attrs.assetCode] ||
          this.attrs.DEFAULT_QUOTE_PRICE,
          1
        ),
        price: sale.quoteAssetPrices[this.attrs.assetCode] ||
          this.attrs.DEFAULT_QUOTE_PRICE,
        fee: offerFee,
        orderBookID: sale.id,
      }
      return a
    }

    async calculateFees (accountId) {
      const response = await calculateFees({
        assetCode: this.attrs.assetCode,
        amount: this.attrs.amount || 0,
        senderAccountId: accountId,
        type: FEE_TYPES.investFee,
      })

      return response
    }

    createBalance (assetCode, accountId) {
      const operation = base.Operation.manageBalance({
        destination: accountId,
        asset: assetCode,
        action: base.xdr.ManageBalanceAction.createUnique(),
      })
      return operation
    }
}
