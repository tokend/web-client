import { Former } from './Former'
import { base, FEE_TYPES } from '@tokend/js-sdk'
import { calculateFees } from '@/js/helpers/fees-helper'

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
      this.attrs.fees.sourceFee.fixed = this.attrs.fees.sourceFee.fixed
      this.attrs.fees.sourceFee.calculatedPercent =
        this.attrs.fees.sourceFee.calculatedPercent

      const operation = base.CreateWithdrawRequestBuilder
        .createWithdrawWithAutoConversion({
          balance: this.attrs.selectedAssetBalanceId,
          amount: this.attrs.amount,
          creatorDetails: this.attrs.creatorDetails,
          destAsset: this.attrs.assetCode,
          expectedDestAssetAmount: this.attrs.amount,
          fee: {
            fixed: this.attrs.fees.sourceFee.fixed,
            percent: this.attrs.fees.sourceFee.calculatedPercent,
          },
        })
      return operation
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
