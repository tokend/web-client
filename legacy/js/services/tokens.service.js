import { xdr, Operation, ManageAssetBuilder, Keypair } from 'tokend-js-sdk'
import { Service } from './service'

export class TokensService extends Service {
  /**
   * Creates a request to create token
   *
   * @param opts
   * @param {string} opts.requestID - request ID, if 0 - creates new, updates
   * otherwise
   * @param {string} opts.code - Token code
   * @param {string} opts.preissuedAssetSigner - AccountID of keypair which will
   * sign request for token to be authrorized to be issued
   * @param {string} opts.maxIssuanceAmount - Max amount can be issued of that
   * token
   * @param {number} opts.policies - Token policies
   * @param {string} opts.initialPreissuedAmount - Amount of pre issued tokens
   * available after creation of the token
   *
   * @param {object} opts.details - Additional details about token
   * @param {string} opts.details.name - Name of the token
   * @param {string} opts.details.logo - Token picture
   * {@link DocumentContainer.getDetailsForSave}
   * @param {string} opts.details.terms - Token terms
   * {@link DocumentContainer.getDetailsForSave}
   *
   * @return {Promise<TransactionResponseBuilder>}
   */
  createTokenCreationRequest (opts) {
    const operation = ManageAssetBuilder.assetCreationRequest(opts)
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Creates balance in users account for provided token
   *
   * @param {string} tokenCode - token code of token, which balance is being
   * created
   * @return {Promise<TransactionResponseBuilder>}
   */
  static createBalance (tokenCode) {
    const operation = Operation.manageBalance(_opts())
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)

    function _opts () {
      return {
        asset: tokenCode,
        action: xdr.ManageBalanceAction.manageBalanceCreate(),
        destination: this._accountId,
        balanceId: Keypair.random().balanceId()
      }
    }
  }

  /**
   * Creates a request to update token
   *
   * @param opts
   * @param {string} opts.requestID - request ID, if 0 - creates new, updates
   * otherwise
   * @param {string} opts.code - Token code
   * @param {number} opts.policies - Token policies
   *
   * @param {object} opts.details - Additional details about token
   * @param {string} opts.details.name - Name of the token
   * @param {string} opts.details.logo - Token picture
   * @param {string} opts.details.logo.key - Key to compose token picture url
   * @param {string} opts.details.logo.type - Content type of token logo
   * @param {string} opts.details.terms - Token terms
   * @param {string} opts.details.terms.type - Content type of terms document
   * @param {string} opts.details.terms.name - Name of terms document
   *
   * @param {string} [opts.source] - The source account for the payment.
   * Defaults to the transaction's source account.
   * @return {Promise<TransactionResponseBuilder>}
   */
  createTokenUpdateRequest (opts) {
    const operation = ManageAssetBuilder.assetUpdateRequest(opts)
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Cancels token creation/update request
   * @param {object} opts
   * @param {string} opts.requestID - request ID
   * @param {string} [opts.source] - The source account for the payment.
   * Defaults to the transaction's source account.
   * @returns {Promise<TransactionResponseBuilder>}
   */
  cancelTokenCreationRequest (opts) {
    const operation = ManageAssetBuilder.cancelAssetRequest(opts)
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Loads all tokens existing in the system
   *
   * @return {Promise<array>} - tokens
   */
  loadTokens () {
    return this._horizonRequestBuilder
      .assets()
      .callWithSignature(this._keypair)
  }

  /**
   * Loads all tokens with specified owner
   *
   * @param [owner] {string} - token owner/creator
   * @return {Promise<array>}
   */
  loadTokensForOwner (owner = this._accountId) {
    return this._horizonRequestBuilder
      .assets()
      .forOwner(owner)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads token with specified code
   *
   * @param code {string} - token code
   * @return {Promise<object>}
   */
  loadTokenByCode (code) {
    return this._horizonRequestBuilder
      .assets()
      .byCode(code)
      .callWithSignature(this._keypair)
  }

  /**
   * Load all token creation request for specified state
   *
   * @param [state] {number} - request state, if '' - loads all requests
   * @return {Promise<object>}
   */
  // TODO: test, may not work:
  loadTokenCreationRequestsForState (state) {
    return this._horizonRequestBuilder
      .reviewableRequestsHelper()
      .assets()
      .forRequestor(this._accountId)
      .forState(state)
      .order('desc')
      .callWithSignature(this._keypair)
  }
}

export const tokensService = new TokensService()
