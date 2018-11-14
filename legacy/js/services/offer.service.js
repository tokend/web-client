import config from '../../../src/config'

import { Service } from './service'
import { ManageOfferBuilder } from 'tokend-js-sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '../const/const'

export class OffersService extends Service {
  /**
   * Creates offer
   * @param opts {@borrows _composeCreateOfferOperation}
   * @return {TransactionResponseBuilder}
   */
  async createOffer (opts) {
    const operation = await this._composeCreateOfferOperation(opts)
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Creates sale offer
   *
   * @param {object} createOpts {@borrows _composeCreateOfferOperation}
   * @param {object} cancelOpts {@borrows _composeCancelOfferOperation}
   * @returns {Promise<object>} - Promise object representing creation of sale
   * offer
   */
  async createSaleOffer (createOpts, cancelOpts) {
    const removeOfferOperation = cancelOpts
      ? await this._composeCancelOfferOperation(cancelOpts)
      : null
    const createOfferOperation = createOpts
      ? await this._composeCreateOfferOperation(createOpts)
      : null
    return this._operationBuilder
      .operation()
      .add(removeOfferOperation)
      .add(createOfferOperation)
      .submit(this._accountId, this._keypair)
  }
  /**
   * @param {object} opts
   * @param {string} opts.amount
   * @param {string} opts.price
   * @param {string} opts.orderBookId - orderBook ID, '0' - for secondary
   * market, saleID {@link SaleEntity}  otherwise
   * @param {string} opts.isBuy - Defines if offer goal buying or selling
  *  base asset
   * @param {string} opts.baseBalance - Base balance id
   * @param {string} opts.quoteBalance - Quote balance id
   * @param {string} opts.fee - Should be loaded externally before creating
  *  offer, use {@link loadOfferFees}
   * @return {xdr.ManageOfferOp}
   * @private
   */
  async _composeCreateOfferOperation (opts) {
    return ManageOfferBuilder.manageOffer(_opts())

    function _opts () {
      return {
        ...opts,
        orderBookID: opts.orderBookId
      }
    }
  }

  /**
   * Cancels existing offer
   *
   * @param opts {@borrows _composeCancelOfferOperation}
   * @return {TransactionResponseBuilder}
   */
  async cancelOffer (opts) {
    const operation = await this._composeCancelOfferOperation(opts)
    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  /**
   * Loads users offers in secondary market
   * @param {object} opts
   * @param {string} opts.base - Base asset
   * @param {string} opts.quote - Quote asset
   * @returns {*|{value}}
   */
  loadUserOffers (opts) {
    return this._horizonRequestBuilder.offers()
      .forAccount(this._accountId)
      .isBuy('')
      .orderBookID(SECONDARY_MARKET_ORDER_BOOK_ID)
      .assetPair(opts.base, opts.quote)
      .order('desc')
      .limit(config.TRANSACTIONS_PER_PAGE)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads user SaleOffers
   *
   * @param {string|number} orderBookID - id of the sale
   * @returns {Promise<object>} - promise object representing sale offers
   */
  async loadUserSaleOffers (orderBookID) {
    return this._horizonRequestBuilder.offers()
      .forAccount(this._accountId)
      .isBuy(true)
      .orderBookID(orderBookID)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads pending offers in secondary market
   *
   * @param {object} opts
   * @param {string} opts.base - Base asset
   * @param {string} opts.quote - Quote asset
   * @param {boolean} opts.isBuy - Defines if offer is bid or ask
   * @returns {Promise<object>} - Promise object representing trade offers
   */
  loadTradeOffers (opts) {
    return this._horizonRequestBuilder.orderBooks()
      .forOrderBookID(SECONDARY_MARKET_ORDER_BOOK_ID)
      .assetPair(opts.base, opts.quote, opts.isBuy)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads completed trades in secondary market
   *
   * @param opts
   * @param opts.base
   * @param opts.quote
   *
   * @returns {Promise<object>} - Promise object representing trades
   */
  loadCompletedTrades (opts) {
    return this._horizonRequestBuilder.trades()
      .assetPair(opts.base, opts.quote)
      .orderBookID(SECONDARY_MARKET_ORDER_BOOK_ID)
      .limit(config.TRANSACTIONS_PER_PAGE)
      .order('desc')
      .callWithSignature(this._keypair)
  }

  /**
   *
   * @param opts
   * @param {object} opts
   * @param {string} opts.baseBalance - Base token code
   * @param {string} opts.quoteBalance - Quote token code
   * @param {string} opts.offerId - ID of the offer to cancel
   * @param {string} opts.price - price of the base token
   * @param {string} opts.orderBookId - orderBook ID, '0' - for secondary
   * market, saleID {@link SaleRecord} otherwise
   * @return {xdr.cancelOfferOp}
   * @private
   */
  async _composeCancelOfferOperation (opts) {
    return ManageOfferBuilder.cancelOffer(await _opts())

    async function _opts () {
      return {
        ...opts,
        offerID: String(opts.offerId),
        price: opts.price,
        orderBookID: opts.orderBookId
      }
    }
  }
}
export const offersService = new OffersService()
