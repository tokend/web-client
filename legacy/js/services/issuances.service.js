import { Service } from './service'
import { BindExternalSystemAccountIdBuilder,
  PreIssuanceRequestOpBuilder,
  CreateIssuanceRequestBuilder
} from 'tokend-js-sdk'

export class IssuanceService extends Service {
  /**
   * Creates token pre-issuance request
   *
   * @param {object} opts
   * @param {xdr.PreIssuanceRequest} opts.request - signed pre issuance request
   *
   * @return {TransactionResponseBuilder}
   */
  createPreIssuanceRequest (opts) {
    const operation = PreIssuanceRequestOpBuilder
      .createPreIssuanceRequestOp({ request: opts[0] })
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Creates issuance request
   *
   * @param {object} opts
   * @param {string} opts.token - token to be issued
   * @param {string} opts.amount - amount to be issued
   * @param {string} opts.receiver - balance ID of the receiver
   * @param {string} opts.reference - Reference of the request
   * @param {object} opts.externalDetails - External details about issuance
   * @param {object|number} [opts.allTasks] - Issuance tasks
   * @param {string} [opts.source] - The source account for the payment.
   * Defaults to the transaction's source account.
   *
   * @return {TransactionResponseBuilder}
   */
  createIssuanceRequest (opts) {
    const operation = CreateIssuanceRequestBuilder
      .createIssuanceRequest(_opts())

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)

    function _opts () {
      return {
        ...opts,
        asset: opts.token,
        allTasks: opts.allTasks || 0
      }
    }
  }

  bindExternalAccount (opts) {
    const operation = BindExternalSystemAccountIdBuilder
      .createBindExternalSystemAccountIdOp(opts)

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }
}

export const issuanceService = new IssuanceService()
