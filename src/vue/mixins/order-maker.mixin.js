import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { base, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { Sdk } from '@/sdk'
import { globalize } from '@/vue/filters/globalize'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'

const OFFER_FEE_TYPE = 'offerFee'

export default {
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.accountId,
    ]),
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    getAssetDetails (assetCode) {
      return this.accountBalances.find(i => i.asset === assetCode)
    },
    /**
     * @param opts
     * @param {object} opts.pair - pair to create order for
     * @param {object} opts.pair.base
     * @param {object} opts.pair.quote
     * @param {object} opts.baseAmount
     * @param {object} opts.quoteAmount
     * @param {object} opts.price
     * @param {object} opts.isBuy
     * @returns {Promise<void>}
     */
    async createOrder (opts) {
      try {
        if (!this.getAssetDetails(opts.pair.base)) {
          await base.manageBalance({
            destination: this.accountId,
            asset: opts.pair.base,
            action: 0, // TODO: use xdr.value for it
          })
          await this.loadBalances(this.accountId)
        }

        if (!this.getAssetDetails(opts.pair.quote)) {
          await base.manageBalance({
            destination: this.accountId,
            asset: opts.pair.quote,
            action: 0, // TODO: use xdr.value for it
          })
          await this.loadBalances(this.accountId)
        }

        const feeType = base.xdr.FeeType.fromName(OFFER_FEE_TYPE).value
        const feeOpts = {
          asset: opts.pair.quote,
          amount: opts.quoteAmount,
          subtype: PAYMENT_FEE_SUBTYPES.outgoing,
          account: this.accountId,
        }
        const fee = (await Sdk.horizon.fees.get(feeType, feeOpts)).data
        const operationOpts = {
          amount: opts.baseAmount,
          price: opts.price,
          orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
          isBuy: opts.isBuy,
          baseBalance: this.getAssetDetails(opts.pair.base).balanceId,
          quoteBalance: this.getAssetDetails(opts.pair.quote).balanceId,
          // For this operation, back-end creates a "calculated fee", that
          // calculates as amount * percent fee. We can ignore the fixed fee
          // because of it's a back-end business
          fee: fee.percent,
        }
        const operation = base.ManageOfferBuilder.manageOffer(operationOpts)

        await Sdk.horizon.transactions.submitOperations(operation)

        Bus.success(globalize('offer-creation-form.success'))
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
  },
}
