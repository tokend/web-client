import { PaymentV2Builder } from 'tokend-js-sdk'
import { Service } from './service'

export class TransferService extends Service {
  /**
   * @param {object} opts
   * @param {string} opts.amount
   * @param {string} opts.asset
   * @param {string} opts.destinationAccountId
   * @param {string} opts.sourceFixedFee
   * @param {string} opts.sourcePercentFee
   * @param {string} opts.sourceFeeAsset
   * @param {string} opts.destinationFixedFee
   * @param {string} opts.destinationPercentFee
   * @param {string} opts.destinationFeeAsset
   * @param {string} opts.sourceBalanceId
   * @param {string} opts.subject
   * @param {boolean} opts.feeFromSource
   * @returns {TransactionBuilder}
   */
  createTransfer (opts) {
    const operation = PaymentV2Builder.paymentV2(_opts())
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)

    function _opts () {
      return {
        sourceBalanceId: opts.sourceBalanceId,
        destination: opts.destinationAccountId,
        amount: opts.amount,
        feeData: {
          sourceFee: {
            maxPaymentFee: +opts.sourcePercentFee,
            fixedFee: +opts.sourceFixedFee,
            feeAsset: opts.sourceFeeAsset
          },
          destinationFee: {
            maxPaymentFee: +opts.destinationPercentFee,
            fixedFee: +opts.destinationFixedFee,
            feeAsset: opts.destinationFeeAsset
          },
          sourcePaysForDest: opts.feeFromSource
        },
        subject: opts.subject
      }
    }
  }

  /**
   * @param {array} transfers
   * @param {object} transfers.transfer
   * @param {object} transfers.transfer.sourceBalanceId
   * @param {object} transfers.transfer.destinationAccountId
   * @param {object} transfers.transfer.amount
   * @param {object} transfers.transfer.feeData
   * @param {object} transfers.transfer.feeData.sourceFee
   * @param {object} transfers.transfer.feeData.sourceFee.maxPaymentFee
   * @param {object} transfers.transfer.feeData.sourceFee.fixedFee
   * @param {object} transfers.transfer.feeData.sourceFee.feeAsset
   * @param {object} transfers.transfer.feeData.destinationFee
   * @param {object} transfers.transfer.feeData.destinationFee.maxPaymentFee
   * @param {object} transfers.transfer.feeData.destinationFee.fixedFee
   * @param {object} transfers.transfer.feeData.destinationFee.feeAsset
   * @param {object} transfers.transfer.sourcePaysForDest
   * @param {object} transfers.transfer.subject
   * @returns {TransactionBuilder}
   */
  createMassTransfer (transfers) {
    const operations = transfers.map(transfer =>
      PaymentV2Builder.paymentV2(_opts(transfer))
    )

    return this._operationBuilder
      .operation()
      .addMany(operations)
      .withRawError()
      .submit(this._accountId, this._keypair)

    function _opts (transfer) {
      return {
        ...transfer,
        destination: transfer.destinationAccountId
      }
    }
  }
}

export const transferService = new TransferService()
