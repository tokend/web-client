import {
  xdr,
  Operation,
  CreateUpdateKYCRequestBuilder,
  CreateManageLimitsRequestBuilder
} from 'tokend-js-sdk'
import { ErrorFactory, errorTypes } from '../errors/factory'
import { Service } from './service'
import get from 'lodash/get'

/**
 * @module accounts
 * Service to load account details
 */
export class AccountsService extends Service {
  /**
   * Loads user account details
   * @return {Promise<object>} - promise object representing account details
   */
  loadAccount () {
    return this._horizonRequestBuilder.accounts()
      .accountId(this._accountId)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads account limits
   * @param {int} type - operation type limits imposed on
   * @param {asset} asset - asset type limits imposed on
   * @return {Promise<object>} - promise object representing account limits
   */

  loadAccountLimits () {
    return this._horizonRequestBuilder.accounts()
      .limits(this._accountId)
      .callWithSignature(this._keypair)
  }

  /**
   * Creates operation to create KYC request
   * @param {object} opts
   * @param {number|string} opts.requestID - set to zero to create new request
   * @param {string} opts.accountToUpdateKYC
   * @param {string} opts.accountTypeToSet
   * @param {number} opts.kycLevelToSet
   * @param {object} opts.kycData
   * @param {string} [opts.source] - The source account for the payment.
   *        Defaults to the transaction's source account.
   * @returns {TransactionBuilder}
   */
  createKycRequest (opts) {
    const operation =
      CreateUpdateKYCRequestBuilder.createUpdateKYCRequest(opts)
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Creates limits update request
   * @param {object} opts
   * @param {string} opts.details - JSON string about proof document
   * @param {string} [opts.source] - The source account for the operation.
   *        Defaults to the transaction's source account.
   * @returns {TransactionBuilder}
   */
  createLimitRequest (opts) {
    const operation =
      CreateManageLimitsRequestBuilder.createManageLimitsRequest(opts)

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Creates balance for provided token code
   * @param {string} code
   * @returns {@link TransactionResponseBuilder} default transaction response
   */
  createBalance (code) {
    const operation = Operation.manageBalance({
      asset: code,
      action: xdr.ManageBalanceAction.create(),
      destination: this._accountId
    })

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Loads details for each balance, including asset_details and opened sales
   * for each asset
   *
   * @return {Promise<array>} Promise object representing user balances
   */
  loadDetailsForEachBalance () {
    return this._horizonRequestBuilder.accounts()
      .details(this._accountId)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads balance id by provided account id
   * @param {string} email
   * @param {string} assetCode
   * @returns {string} balance_id
   */
  async loadBalanceIdByEmail (email, assetCode) {
    const accountId = await this.loadAccountIdByEmail(email)
    const accountBalances = await this.loadAccountBalancesById(accountId)
    const balance = accountBalances.find(balance => balance.asset === assetCode)
    if (!balance) ErrorFactory.throwError(errorTypes.NotFoundError)
    return balance.balance_id
  }

  loadBalanceIdByAccountid (accountId, tokenCode) {
    return this.loadAccountBalancesById(accountId)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(allBalances => {
        const balance = allBalances.find(balance => balance.asset === tokenCode)
        if (!balance) ErrorFactory.throwError(errorTypes.NotFoundError)
        return balance.balance_id
      })
  }

  /**
   * Loads all account balances by account id
   * @param {string} accountId
   * @returns {Promise <balances>} Promise object represents account balances
   */
  loadAccountBalancesById (accountId) {
    return this._horizonRequestBuilder.accounts()
      .balances(accountId)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads account id for provided email
   * @param {string} email
   * @returns {Promise} Promise object representing account id
   */
  loadAccountIdByEmail (email) {
    return this._apiRequestBuilder.userId()
      .forEmail(email)
      .get()
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(r => r.data('account_id'))
      .catch(e => '')
  }

  /**
   * Loads email address by provided account id
   * @param accountId
   * @returns {string} email
   */
  loadEmailByAccountId (accountId) {
    const params = { addresses: [accountId] }
    return this._apiRequestBuilder.details()
      .setParams(params)
      .sign(this._keypair)
      .json()
      .post()
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(response => get(Object.values(response.data('users')), '[0].email'))
  }

  /**
   * Loads array of emails by provided array of account id's
   * @param {array} addresses
   * @returns {object} details
   */
  loadMultipleAccountDetails (addresses) {
    const params = { addresses }

    return this._apiRequestBuilder.details()
      .setParams(params)
      .sign(this._keypair)
      .json()
      .post()
  }

  /**
   * Loads account id by provided balance id
   * @param balanceId
   * @return {Promise} Promise object representing account id
   */
  loadAccountIdByBalanceId (balanceId) {
    return this._horizonRequestBuilder.balances()
      .account(balanceId)
      .callWithSignature(this._keypair)
  }
}

export const accountsService = new AccountsService()
