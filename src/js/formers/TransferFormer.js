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
        isPaidForRecipient: false,
        recipientAccountId: '',
        accountBalanceByCode: '',
        feeData: {
          sourceFee: {
            percent: '',
            fixed: '',
          },
          destinationFee: {
            percent: '',
            fixed: '',
          },
          sourcePaysForDest: '',
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
            percent: str(attrs.feeData.sourceFee.percent),
            fixed: str(attrs.feeData.sourceFee.fixed),
          },
          destinationFee: {
            percent: str(attrs.feeData.destinationFee.percent),
            fixed: str(attrs.feeData.destinationFee.fixed),
          },
          sourcePaysForDest: attrs.feeData.sourcePaysForDest,
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

      this.attrs.feeData.sourceFee.percent =
        response.sourceFee.calculatedPercent
      this.attrs.feeData.sourceFee.fixed = response.sourceFee.fixed
      this.attrs.feeData.destinationFee.percent =
        response.destinationFee.calculatedPercent
      this.attrs.feeData.destinationFee.fixed = response.destinationFee.fixed
      this.attrs.feeData.sourcePaysForDest = response.isPaidForRecipient

      return response
    }

    async _getCounterparty (recipient) {
      const response = await getCounterparty(recipient)
      this.attrs.recipientAccountId = response
      this.attrs.destination = this.attrs.recipientAccountId
      return response
    }
}
