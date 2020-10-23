import { Former } from './Former'
import { Document, base } from '@tokend/js-sdk'

/**
 * Collects the attributes for asset-related operations
 * @class
 * @implements {Former}
 */
export class TransferFormer extends Former {
  constructor (form, view) {
    super({ form, view })
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

    populate ({ form, view }) {
      this.attrs = this.attrs || this._defaultAttrs
      this.attrs.sourceBalanceId = view.opts.sourceBalanceId
      this.attrs.destination = view.opts.destinationAccountId
      this.attrs.amount = view.opts.amount
      this.attrs.feeData.sourceFee.percent = view.opts.sourcePercentFee
      this.attrs.feeData.sourceFee.fixed = view.opts.sourceFixedFee
      this.attrs.feeData.destinationFee.percent = view.opts
        .destinationPercentFee
      this.attrs.feeData.destinationFee.fixed = view.opts.destinationFixedFee
      this.attrs.feeData.sourcePaysForDest = form.isPaidForRecipient
      this.attrs.subject = view.opts.subject
      this.attrs.asset = form.asset.code
    }

    _buildOp () {
      const attrs = this.attrs

      return base.PaymentBuilder.payment({
        sourceBalanceId: attrs.sourceBalanceId,
        destination: attrs.destination,
        amount: attrs.amount,
        feeData: {
          sourceFee: {
            percent: attrs.feeData.sourceFee.percent,
            fixed: attrs.feeData.sourceFee.fixed,
          },
          destinationFee: {
            percent: attrs.feeData.destinationFee.percent,
            fixed: attrs.feeData.destinationFee.fixed,
          },
          sourcePaysForDest: attrs.feeData.sourcePaysForDest,
        },
        subject: attrs.subject,
        asset: attrs.asset,
      })
    }
}
