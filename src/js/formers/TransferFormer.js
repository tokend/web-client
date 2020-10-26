import { Former } from './Former'
import { Document, base, FEE_TYPES } from '@tokend/js-sdk'
import { calculateFees, getCounterparty } from '@/js/helpers/transfer-helper'
import { str } from './op-build-helpers'

/**
 * Collects the attributes for asset-related operations
 * @class
 * @implements {Former}
 */
export class TransferFormer extends Former {
  constructor (form, viewOpts) {
    super({ form, viewOpts })
  }
    attr = this.attrs || this._defaultAttrs
    get _defaultAttrs () {
      return {
        sourceBalanceId: '',
        destination: '',
        amount: '',
        recipient: '',
        subject: '',
        isPaidForRecipient: false,
        recipientAccountId: '',
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

    async buildOps () {
      await Document.uploadDocumentsDeep(this.attrs)
      return [this._buildOp()]
    }

    async calculateFees (senderAccountId) {
      await this._getCounterparty(this.attrs.recipient)
      const response = await calculateFees({
        assetCode: this.attrs.asset,
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
      return response
    }

    populate ({ form, viewOpts }) {
      this.attrs = this.attrs || this._defaultAttrs
      this.attrs.sourceBalanceId = viewOpts.opts.sourceBalanceId

      this.attrs.destination = viewOpts.recipientAccountId
      this.attrs.amount = form.amount
      this.attrs.recipient = form.recipient
      // this.attrs.feeData.sourceFee.percent = viewOpts.sourcePercentFee
      // this.attrs.feeData.sourceFee.fixed = viewOpts.sourceFixedFee
      // this.attrs.feeData.destinationFee.percent = viewOpts
      // .destinationPercentFee
      // this.attrs.feeData.destinationFee.fixed = viewOpts.destinationFixedFee
      // this.attrs.feeData.sourcePaysForDest = form.isPaidForRecipient
      this.attrs.subject = form.subject
      this.attrs.asset = form.asset.code
    }

    _buildOp () {
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
        asset: attrs.asset,
      })
    }
}
