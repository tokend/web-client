import { Former } from './Former'
import { calculateFees } from '@/js/helpers/fees-helper'
import { FEE_TYPES } from '@tokend/js-sdk'

/**
 * Collects the attributes for transfer-related operations
 * @class
 * @implements {Former}
 */
export class TradeFormer extends Former {
    attrs = this.attrs || this._defaultAttrs
    get _defaultAttrs () {
      return {
        price: '',
        amount: '',
        assetCode: '',
        isBuy: false,
        assetPair: {},
        quoteAmount: '',
        accountId: '',
      }
    }

    buildOps () {
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
