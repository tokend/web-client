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

      <trade-history
        v-if="assets.base"
        class="trade-exchange__history"
        :assets="assets"
        :trade-history="tradeHistory"
        :is-loading="isTradeHistoryLoading"
      />

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
          />

          <trade-orders
            class="trade-exchange__orders-list"
            :assets="assets"
            :is-buy="false"
            :is-loading="isSellOrdersLoading"
            :orders-list="sellOrdersList"
            @reload-trades="loadTradeOrders"
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

export default {
  name: 'trade-exchange',
  components: {
    Chart,
    TradeHistory,
    TradeOrders,
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
    config,
  }),
  watch: {
    assets: {
      deep: true,
      handler: function (assets) {
        if (assets.base && assets.quote) {
          this.loadTradeOrders()
          this.loadTradeHistory()
        }
      },
    },
    '$route.query': {
      deep: true,
      handler: function () {
        this.setSelectedAssets()
      },
    },
  },
  created () {
    this.setSelectedAssets()
  },
  methods: {
    async loadTradeHistory () {
      this.isTradeHistoryLoading = true
      if (this.assets.base) {
        try {
          const response = await Sdk.horizon.trades.getPage({
            base_asset: this.assets.base,
            quote_asset: this.assets.quote,
            order_book_id: SECONDARY_MARKET_ORDER_BOOK_ID,
          })
          this.tradeHistory = response.data
        } catch (error) {
          ErrorHandler.process(error)
        }
      }
      this.isTradeHistoryLoading = false
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
    async loadTradeablePairs () {
      try {
        const response = await Sdk.horizon.assetPairs.getAll()
        const baseAsset = response.data[0].base
        const quoteAsset = response.data[0].quote

        this.assets.base = baseAsset
        this.assets.quote = quoteAsset
        this.$router.replace({
          name: this.$route.name,
          query: {
            base: baseAsset,
            quote: quoteAsset,
          },
        })
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    setSelectedAssets () {
      this.assets.base = this.$route.query.base
      this.assets.quote = this.$route.query.quote
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

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
}

.trade-exchange__orders {
  margin-top: 4.8rem;
}

.trade-exchange__orders-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.trade-exchange__orders-list {
  flex: 49%;

  &:not(:last-child) {
    margin-right: 1.6rem;
  }
}
</style>
