import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
// import { dispatchAppEvent } from 'L@/js/events/helpers'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { base } from '@tokend/js-sdk'

// const SECONDARY_MARKET_ORDER_BOOK_ID = 0

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
        if (!this.accountBalances[opts.pair.base]) {
          await base.manageBalance({
            destination: this.accountId,
            asset: opts.pair.base,
            action: 0, // TODO: use xdr.value for it
          })
          await this.loadBalances(this.accountId)
        }

        if (!this.accountBalances[opts.pair.quote]) {
          await base.manageBalance({
            destination: this.accountId,
            asset: opts.pair.quote,
            action: 0, // TODO: use xdr.value for it
          })
          await this.loadBalances(this.accountId)
        }

        // const fee =
        // await feeService.loadOfferFeeByAmount(
        //   opts.pair.quote, opts.quoteAmount
        // )

        // await offersService.createOffer({
        //   amount: opts.baseAmount,
        //   price: opts.price,
        //   orderBookId: SECONDARY_MARKET_ORDER_BOOK_ID,
        //   isBuy: opts.isBuy,
        //   baseBalance: this.accountBalances[opts.pair.base].balance_id,
        //   quoteBalance: this.accountBalances[opts.pair.quote].balance_id,
        //   fee: fee.percent
        // })
        // dispatchAppEvent(commonEvents.createdOrder)
        Bus.success('Offer successfully created')
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
  },
}
