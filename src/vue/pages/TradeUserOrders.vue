<template>
  <div class="trade-user-orders">
    <trade-open-orders
      :assets="assets"
      :is-loading="isOpenOrdersLoading"
      :open-orders="openOrders"
    />
    <div class="trade-user-orders__history">
      <user-trade-history
        :assets="assets"
        :trade-history="tradeHistory"
        :is-loading="isTradeHistoryLoading"
      />
      <div class="trade-user-orders__history-collection-loader">
        <collection-loader
          :first-page-loader="loadTradeHistory"
          :page-limit="recordsToShow"
          @first-page-load="setTradeHistory"
          @next-page-load="extendTradeHistory"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TradeOpenOrders from '@/vue/pages/TradeUserOrders/Trade.OpenOrders'
import UserTradeHistory from '@/vue/pages/TradeUserOrders/Trade.UserTradeHistory'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { Sdk } from '@/sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ManageOfferRecord } from '@/js/records/operations/manage-offer.record'
import CollectionLoader from '@/vue/common/CollectionLoader'

export default {
  name: 'trade-user-orders',
  components: {
    TradeOpenOrders,
    UserTradeHistory,
    CollectionLoader,
  },
  props: {
    // prop from parent router-view component
    componentConfig: { type: Object, required: true },
  },
  data: () => ({
    assets: {
      base: '',
      quote: '',
    },
    openOrders: [],
    isOpenOrdersLoading: false,
    tradeHistory: [],
    isTradeHistoryLoading: false,
    recordsOrder: 'desc',
    recordsToShow: 10,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },
  watch: {
    'componentConfig.assets': {
      deep: true,
      handler: async function (assets) {
        this.assets.base = assets.base
        this.assets.quote = assets.quote
        if (assets.base && assets.quote) {
          await this.loadOrdersHistory()
          await this.loadTradeHistory()
        }
      },
    },
  },
  async created () {
    this.setSelectedAssets()
    await this.loadOrdersHistory()
    await this.loadTradeHistory()
  },
  methods: {
    setSelectedAssets () {
      this.assets.base = this.$route.query.base
      this.assets.quote = this.$route.query.quote
    },
    async loadOrdersHistory () {
      this.isOpenOrdersLoading = true
      try {
        const response = await Sdk.horizon.account.getOffers(
          this.accountId,
          {
            base_asset: this.assets.base,
            quote_asset: this.assets.quote,
            is_buy: '', // buy and sell
            order_book_id: SECONDARY_MARKET_ORDER_BOOK_ID,
          },
        )
        this.openOrders = response.data
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isOpenOrdersLoading = false
    },
    async loadTradeHistory () {
      this.isTradeHistoryLoading = true
      let response
      try {
        response = await Sdk.horizon.account.getPayments(
          this.accountId,
          {
            base_asset: this.assets.base,
            quote_asset: this.assets.quote,
            order_book_id: SECONDARY_MARKET_ORDER_BOOK_ID,
            order: this.recordsOrder,
            limit: this.recordsToShow,
          }
        )
        return response
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isTradeHistoryLoading = false
      return response
    },
    setTradeHistory (data) {
      this.tradeHistory = data.map(record => new ManageOfferRecord(
        record,
        {
          accountId: this.accountId,
          baseAsset: this.assets.base,
          quoteAsset: this.assets.quote,
        }
      ))
      this.isTradeHistoryLoading = false
    },
    extendTradeHistory (data) {
      this.tradeHistory = this.tradeHistory
        .concat(data.map(record => new ManageOfferRecord(
          record,
          {
            accountId: this.accountId,
            baseAsset: this.assets.base,
            quoteAsset: this.assets.quote,
          }
        )))
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

.trade-user-orders {
  margin-top: 4rem;
}

.trade-user-orders__history {
  margin-top: 3.2rem;
}

.trade-user-orders__history-collection-loader {
  margin-top: 1.6rem;
  display: flex;
  justify-content: center;
}

</style>
