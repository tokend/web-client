import { Service } from './service'
import { CreateWithdrawRequestBuilder } from 'tokend-js-sdk'

export class WithdrawService extends Service {
  /**
   * Creates operation to create withdraw request with autoconversion
   * @param {object} opts
   * @param {string} opts.balance - Balance ID from which withdraw will be
   * perfromed
   * @param {string} opts.amount - amount to be withdrawn
   * @param {object} opts.fee - fee to be charged
   * @param {string} opts.fee.fixed - fixed fee to be charged
   * @param {string} opts.fee.percent - percent fee to be charged
   * @param {object} opts.externalDetails - External details needed for PSIM to
   * process withdraw operation
   * @param {string} opts.destAsset - Asset in which specifed amount will be
   * autoconverted
   * @param {string} opts.expectedDestAssetAmount - Expected dest asset amount
   * @returns {TransactionResponseBuilder}
   */
  createWithdrawalRequest (opts) {
    const operation = CreateWithdrawRequestBuilder
      .createWithdrawWithAutoConversion(opts)

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }
}

export const withdrawService = new WithdrawService()
