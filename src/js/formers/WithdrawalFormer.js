import { Former } from './Former'
import { base, FEE_TYPES } from '@tokend/js-sdk'
import { calculateFees } from '@/js/helpers/withdrawal-helper'

/**
 * Collects the attributes for withdrawal operations
 * @class
 * @implements {Former}
 */

export class WithdrawalFormer extends Former {
    attrs = this.attrs || this._defaultAttrs

    get _defaultAttrs () {
      return {
        assetCode: '',
        amount: '0',
        fees: {
          sourceFee: {
            fixed: '',
            calculatedPercent: '',
          },
        },
        accountId: '',
        selectedAssetBalanceId: '',
        creatorDetails: {
          address: '',
          comment: '',
        },
      }
    }

    buildOps () {
      const operation = base.CreateWithdrawRequestBuilder
        .createWithdrawWithAutoConversion(this._createOptions())
      return operation
    }

    _createOptions () {
      return {
        balance: this.attrs.selectedAssetBalanceId,
        amount: this.attrs.amount,
        creatorDetails: this.attrs.creatorDetails,
        destAsset: this.attrs.assetCode,
        expectedDestAssetAmount: this.attrs.amount,
        fee: {
          fixed: this.attrs.fees.sourceFee.fixed,
          percent: this.attrs.fees.sourceFee.calculatedPercent,
        },
      }
    }

    async calculateFees () {
      const attrs = this.attrs
      const response = await calculateFees({
        assetCode: attrs.assetCode,
        amount: attrs.amount || 0,
        senderAccountId: attrs.accountId,
        type: FEE_TYPES.withdrawalFee,
      })
      return response
    }
}
