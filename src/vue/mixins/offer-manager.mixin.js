import { base } from '@tokend/js-sdk'
import { api } from '@/api'

import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'

import { vuexTypes } from '@/vuex'
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
      accountId: vuexTypes.accountId,
    }),
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    getAssetDetails (assetCode) {
      return this.accountBalances.find(i => i.asset.code === assetCode)
    },

    /**
     * @param {object} opts
     * @param {object} opts.baseBalance - balance id of the base asset
     * @param {string} opts.quoteBalance - balance id of the quote asset
     * @param {string} opts.offerId - offer id
     * @param {string} opts.price - offer price
     * @returns {Promise<void>}
     */

    async cancelOpts (opts) {
      return base.ManageOfferBuilder.cancelOffer({
        ...opts,
        offerID: String(opts.offerId),
        price: opts.price,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
      })
    },

    async cancelOffer (opts) {
      const operation = await this.cancelOpts(opts)
      await api.postOperations(operation)
    },

    /**
     * @param {object} opts
     * @param {object} opts.pair - pair to create offer for
     * @param {string} opts.pair.base
     * @param {string} opts.pair.quote
     * @param {string} opts.baseAmount
     * @param {string} opts.quoteAmount
     * @param {string} opts.price
     * @param {object} opts.fee
     * @param {string} opts.fee.calculatedPercent
     * @param {boolean} opts.isBuy
     * @returns {Promise<void>}
     */

    async createOpts (opts) {
      await this.createAssetPairBalances(opts.pair)
      return {
        amount: opts.baseAmount,
        price: opts.price,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        isBuy: opts.isBuy,
        baseBalance: this.getAssetDetails(opts.pair.base).id,
        quoteBalance: this.getAssetDetails(opts.pair.quote).id,
        // For this operation, back-end creates a "calculated fee", that
        // calculates as amount * percent fee. We can ignore the fixed fee
        // because of this is a back-end business
        fee: opts.fee.calculatedPercent,
      }
    },

    async createOffer (opts) {
      const operationOpts = await this.createOpts(opts)
      const operation = base.ManageOfferBuilder.manageOffer(operationOpts)
      await api.postOperations(operation)
    },

    async updateOffer (cancelOpts, createOpts) {
      const cancelOperation = await this.cancelOpts(cancelOpts)
      const operationOpts = await this.createOpts(createOpts)
      const createOperation = base.ManageOfferBuilder.manageOffer(operationOpts)
      await api.postOperations(cancelOperation, createOperation)
    },

    async createAssetPairBalances (assetPair) {
      if (!this.getAssetDetails(assetPair.base)) {
        const operation = base.Operation.manageBalance({
          destination: this.accountId,
          asset: assetPair.base,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
        await api.postOperations(operation)
        await this.loadBalances()
      }

      if (!this.getAssetDetails(assetPair.quote)) {
        const operation = base.Operation.manageBalance({
          destination: this.accountId,
          asset: assetPair.quote,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
        await api.postOperations(operation)
        await this.loadBalances()
      }
    },
  },
}
