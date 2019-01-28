<template>
  <div class="trade-exchange">
    <div v-if="assets.base">
      <div class="trade-exchange__chart" v-if="assets.base">
        <chart
          v-if="assets.base !== config.DEFAULT_QUOTE_ASSET"
          :base-asset="assets.base"
          :quote-asset="config.DEFAULT_QUOTE_ASSET"
        />
      </div>

      <div class="trade-exchange__history">
        <trade-history
          v-if="assets.base"
          :assets="assets"
          :trade-history="tradeHistory"
          :is-loading="isTradeHistoryLoading"
        />
        <div class="trade-exchange__history-collection-loader">
          <collection-loader
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
        <div v-if="assets.base" class="trade-exchange__orders-wrapper">
          <trade-orders
            class="trade-exchange__orders-list"
            :assets="assets"
            :is-buy="true"
            :is-loading="isBuyOrdersLoading"
            :orders-list="buyOrdersList"
            @reload-trades="componentConfig.isNeededToReloadData = true"
          />

          <trade-orders
            class="trade-exchange__orders-list"
            :assets="assets"
            :is-buy="false"
            :is-loading="isSellOrdersLoading"
            :orders-list="sellOrdersList"
            @reload-trades="componentConfig.isNeededToReloadData = true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from '@/vue/common/chart/Chart'
import TradeHistory from '@/vue/pages/TradeExchange/Trade.History'
import TradeOrders from '@/vue/pages/TradeExchange/Trade.Orders'
import { ErrorHandler } from '@/js/helpers/error-handler'
import config from '@/config'
import { Sdk } from '@/sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import CollectionLoader from '@/vue/common/CollectionLoader'

export default {
  name: 'trade-exchange',
  components: {
    Chart,
    TradeHistory,
    TradeOrders,
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
    tradeHistory: [],
    buyOrdersList: [],
    sellOrdersList: [],
    isTradeHistoryLoading: false,
    isBuyOrdersLoading: false,
    isSellOrdersLoading: false,
    recordsOrder: 'desc',
    recordsToShow: 10,
    config,
  }),
  watch: {
    async 'componentConfig.isNeededToReloadData' (status) {
      if (status) {
        await this.loadTradeOrders()
        await this.loadTradeHistory()
        // says to Trade component that current loaded data is actual
        this.componentConfig.isNeededToReloadData = false
      }
    },
    'componentConfig.assets': {
      deep: true,
      handler: function (assets) {
        this.setCurrentAssets(assets)
        if (assets.base && assets.quote) {
          this.loadTradeOrders()
          this.loadTradeHistory()
        }
      },
    },
  },
  created () {
    this.setCurrentAssets(this.componentConfig.assets)
    if (this.componentConfig.assets.base) {
      this.loadTradeOrders()
      this.loadTradeHistory()
    }
  },
  methods: {
    async loadTradeHistory () {
      this.isTradeHistoryLoading = true
      let response = {}
      try {
        response = await Sdk.horizon.trades.getPage({
          base_asset: this.assets.base,
          quote_asset: this.assets.quote,
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
    async loadTradeOrders () {
      await this.loadTradeBuyOrders()
      await this.loadTradeSellOrders()
    },
    async loadTradeBuyOrders () {
      this.isBuyOrdersLoading = true
      try {
        const response = await Sdk.horizon.orderBook.getAll({
          base_asset: this.assets.base,
          quote_asset: this.assets.quote,
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
          base_asset: this.assets.base,
          quote_asset: this.assets.quote,
          is_buy: false,
        })
        this.sellOrdersList = response.data
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isSellOrdersLoading = false
    },
    setCurrentAssets (assets) {
      this.assets.base = assets.base
      this.assets.quote = assets.quote
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
