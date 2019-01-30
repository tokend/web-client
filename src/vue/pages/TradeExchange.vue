<template>
  <div class="trade-exchange">
    <div v-if="assetPair.base">
      <div class="trade-exchange__chart">
        <chart
          v-if="assetPair.base !== config.DEFAULT_QUOTE_ASSET"
          :base-asset="assetPair.base"
          :quote-asset="config.DEFAULT_QUOTE_ASSET"
        />
      </div>

      <div class="trade-exchange__history">
        <trade-history-renderer
          :asset-pair="assetPair"
          :trade-history="tradeHistory"
          :is-loading="isTradeHistoryLoading"
        />
        <div class="trade-exchange__history-collection-loader">
          <collection-loader
            :key="`collection-loader-${assetPair.base}-${assetPair.quote}`"
            :first-page-loader="loadTradeHistory"
            :page-limit="recordsToShow"
            @first-page-load="setTradeHistory"
            @next-page-load="extendTradeHistory"
          />
        </div>
      </div>

      <div class="trade-exchange__orders">
        <h2 class="app__table-title">
          {{ 'trade.orders-section-title' | globalize }}
        </h2>
        <div class="trade-exchange__orders-wrapper">
          <trade-orders-renderer
            class="trade-exchange__orders-list"
            :asset-pair="assetPair"
            :is-buy="true"
            :is-loading="isBuyOrdersLoading"
            :orders-list="buyOrdersList"
            @reload-trades="loadData"
          />

          <trade-orders-renderer
            class="trade-exchange__orders-list"
            :asset-pair="assetPair"
            :is-buy="false"
            :is-loading="isSellOrdersLoading"
            :orders-list="sellOrdersList"
            @reload-trades="loadData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from '@/vue/common/chart/Chart'
import TradeHistoryRenderer from '@/vue/pages/TradeExchange/Trade.HistoryRenderer'
import TradeOrdersRenderer from '@/vue/pages/TradeExchange/Trade.OrdersRenderer'
import { ErrorHandler } from '@/js/helpers/error-handler'
import config from '@/config'
import { Sdk } from '@/sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import CollectionLoader from '@/vue/common/CollectionLoader'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'trade-exchange',
  components: {
    Chart,
    TradeHistoryRenderer,
    TradeOrdersRenderer,
    CollectionLoader,
  },
  data: () => ({
    tradeHistory: [],
    buyOrdersList: [],
    sellOrdersList: [],
    isTradeHistoryLoading: false,
    isBuyOrdersLoading: false,
    isSellOrdersLoading: false,
    recordsOrder: 'desc',
    recordsToShow: 2,
    config,
  }),
  computed: {
    assetPair () {
      return {
        base: this.$route.query.base,
        quote: this.$route.query.quote,
      }
    },
  },
  watch: {
    assetPair: {
      deep: true,
      handler: function (assetPair) {
        this.setCurrentAssets(assetPair)
        if (assetPair.base && assetPair.quote) {
          this.loadData()
        }
      },
    },
  },
  async created () {
    this.setCurrentAssets(this.assetPair)
    if (this.assetPair.base) {
      await this.loadData()
    }
    Bus.on(Bus.eventList.reloadTradeData, this.loadData)
  },
  methods: {
    async loadData () {
      await this.loadTradeOrders()
      await this.loadTradeHistory()
    },
    async loadTradeOrders () {
      await this.loadTradeBuyOrders()
      await this.loadTradeSellOrders()
    },
    async loadTradeHistory () {
      this.isTradeHistoryLoading = true
      let response = {}
      try {
        response = await Sdk.horizon.trades.getPage({
          base_asset: this.assetPair.base,
          quote_asset: this.assetPair.quote,
          order_book_id: SECONDARY_MARKET_ORDER_BOOK_ID,
          order: this.recordsOrder,
          limit: this.recordsToShow,
        })
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isTradeHistoryLoading = false
      return response
    },
    setTradeHistory (data) {
      this.tradeHistory = data
      this.isTradeHistoryLoading = true
    },
    extendTradeHistory (data) {
      this.tradeHistory = this.tradeHistory.concat(data)
    },
    async loadTradeBuyOrders () {
      this.isBuyOrdersLoading = true
      try {
        const response = await Sdk.horizon.orderBook.getAll({
          base_asset: this.assetPair.base,
          quote_asset: this.assetPair.quote,
          is_buy: true,
        })
        this.buyOrdersList = response.data
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isBuyOrdersLoading = false
    },
    async loadTradeSellOrders () {
      this.isSellOrdersLoading = true
      try {
        const response = await Sdk.horizon.orderBook.getAll({
          base_asset: this.assetPair.base,
          quote_asset: this.assetPair.quote,
          is_buy: false,
        })
        this.sellOrdersList = response.data
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isSellOrdersLoading = false
    },
    setCurrentAssets (assetPair) {
      this.assetPair.base = assetPair.base
      this.assetPair.quote = assetPair.quote
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

$custom-breakpoint: 985px;

.trade-exchange__asset-selector-field {
  display: inline-block;
  width: auto;
}

.trade-exchange__asset-selector-balances {
  margin-top: 2.4rem;
}

.trade-exchange__asset-selector-balances-value {
  font-size: 2.8rem;
  font-weight: 400;
}

.trade-exchange__asset-selector-balances-label {
  font-size: 1.6rem;
  color: $col-text-secondary;
}

.trade-exchange__chart {
  margin-top: -2.4rem;

  @include respond-to($custom-breakpoint) {
    margin-top: 0;
  }
}

.trade-exchange__orders {
  margin-top: 4.8rem;
}

.trade-exchange__orders-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @include respond-to($custom-breakpoint) {
    flex-direction: column;
  }
}

.trade-exchange__orders-list {
  max-width: 49.5%;

  @include respond-to($custom-breakpoint) {
    max-width: 100%;
    width: 100%;
  }

  &:not(:last-child) {
    margin-right: 1.6rem;

    @include respond-to($custom-breakpoint) {
      margin-right: 0;
      margin-bottom: 1.6rem;
    }
  }
}
.trade-exchange__history-collection-loader {
  margin-top: 1.6rem;
  display: flex;
  justify-content: center;
}
</style>
