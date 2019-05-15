import { base, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { api } from '@/api'

import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'

import { vuexTypes } from '@/vuex'
import { mapActions, mapGetters } from 'vuex'

const OFFER_FEE_TYPE = 'offerFee'

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
      return this.accountBalances.find(i => i.asset === assetCode)
    },

    /**
     * @param {object} opts
     * @param {object} opts.pair - pair to create offer for
     * @param {string} opts.pair.base
     * @param {string} opts.pair.quote
     * @param {string} opts.baseAmount
     * @param {string} opts.quoteAmount
     * @param {string} opts.price
     * @param {boolean} opts.isBuy
     * @returns {Promise<void>}
     */
    async createOffer (opts) {
      if (!this.getAssetDetails(opts.pair.base)) {
        const operation = base.Operation.manageBalance({
          destination: this.accountId,
          asset: opts.pair.base,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
        await api.postOperations(operation)
        await this.loadBalances(this.accountId)
      }

      if (!this.getAssetDetails(opts.pair.quote)) {
        const operation = base.Operation.manageBalance({
          destination: this.accountId,
          asset: opts.pair.quote,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
        await api.postOperations(operation)
        await this.loadBalances(this.accountId)
      }

      const feeType = base.xdr.FeeType.fromName(OFFER_FEE_TYPE).value

      const endpoint = `/v3/accounts/${this.accountId}/calculated_fees`
      const query = {
        asset: opts.pair.quote,
        fee_type: feeType,
        subtype: PAYMENT_FEE_SUBTYPES.outgoing,
        amount: opts.quoteAmount,
      }

      const { data: fee } = await api.get(endpoint, query)

      const operationOpts = {
        amount: opts.baseAmount,
        price: opts.price,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        isBuy: opts.isBuy,
        baseBalance: this.getAssetDetails(opts.pair.base).id,
        quoteBalance: this.getAssetDetails(opts.pair.quote).id,
        // For this operation, back-end creates a "calculated fee", that
        // calculates as amount * percent fee. We can ignore the fixed fee
        // because of this is a back-end business
        fee: fee.calculatedPercent,
      }
      const operation = base.ManageOfferBuilder.manageOffer(operationOpts)

      await api.postOperations(operation)
    },

    /**
     * @param {object} opts
     * @param {object} opts.baseBalance - balance id of the base asset
     * @param {string} opts.quoteBalance - balance id of the quote asset
     * @param {string} opts.offerId - offer id
     * @param {string} opts.price - offer price
     * @returns {Promise<void>}
     */
    async cancelOffer (opts) {
      const operation = base.ManageOfferBuilder.cancelOffer({
        ...opts,
        offerID: String(opts.offerId),
        price: opts.price,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
      })
      await api.postOperations(operation)
    },
  },
}
