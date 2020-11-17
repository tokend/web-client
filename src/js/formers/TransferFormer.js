import { Former } from './Former'
import { base, FEE_TYPES } from '@tokend/js-sdk'
import { calculateFees, getCounterparty } from '@/js/helpers/fees-helper'
import { str } from './op-build-helpers'

/**
 * Collects the attributes for transfer-related operations
 * @class
 * @implements {Former}
 */
export class TransferFormer extends Former {
    attrs = this.attrs || this._defaultAttrs
    get _defaultAttrs () {
      return {
        sourceBalanceId: '',
        destination: '',
        amount: '',
        recipient: '',
        subject: '',
        isPaidFeeForRecipient: false,
        recipientAccountId: '',
        fee: {
          sourceFee: {
            percent: '',
            fixed: '',
          },
          destinationFee: {
            percent: '',
            fixed: '',
          },
        },
      }
    }

    buildOps () {
      const attrs = this.attrs

      return base.PaymentBuilder.payment({
        sourceBalanceId: attrs.sourceBalanceId,
        destination: attrs.recipientAccountId,
        amount: attrs.amount,
        feeData: {
          sourceFee: {
            percent: str(attrs.fee.sourceFee.percent),
            fixed: str(attrs.fee.sourceFee.fixed),
          },
          destinationFee: {
            percent: str(attrs.fee.destinationFee.percent),
            fixed: str(attrs.fee.destinationFee.fixed),
          },
          sourcePaysForDest: attrs.isPaidFeeForRecipient,
        },
        subject: attrs.subject,
        asset: attrs.assetCode,
      })
    }

    async calculateFees (senderAccountId) {
      await this._getCounterparty(this.attrs.recipient)

      const response = await calculateFees({
        assetCode: this.attrs.assetCode,
        amount: this.attrs.amount,
        type: FEE_TYPES.paymentFee,
        recipientAccountId: this.attrs.recipientAccountId,
        senderAccountId: senderAccountId,
      })

      this.attrs.fee.sourceFee.percent =
        response.sourceFee.calculatedPercent
      this.attrs.fee.sourceFee.fixed = response.sourceFee.fixed
      this.attrs.fee.destinationFee.percent =
        response.destinationFee.calculatedPercent
      this.attrs.fee.destinationFee.fixed = response.destinationFee.fixed

      return response
    }

    async _getCounterparty (recipient) {
      const response = await getCounterparty(recipient)
      this.attrs.recipientAccountId = response
      this.attrs.destination = this.attrs.recipientAccountId
      return response
    }
}
