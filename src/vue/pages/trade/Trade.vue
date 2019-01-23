<template>
  <div class="trade">
    <top-bar>
      <template slot="main">
        <router-link
          :to="{ name: 'app.trade' }"
        >
          {{ 'trade.exhange-view' | globalize }}
        </router-link>
        <router-link
          :to="{ name: 'app.trade' }"
        >
          {{ 'trade.my-orders-view' | globalize }}
        </router-link>
      </template>
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isCreateBuyOrderDrawerShown = true"
        >
          {{ 'trade.create-buy-order-button' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-raised"
          @click="isCreateSellOrderDrawerShown = true"
        >
          {{ 'trade.create-sell-order-button' | globalize }}
        </button>
      </template>
    </top-bar>

    <div class="trade__asset-selector">
      <div class="trade__asset-selector-wrapper">
        <select-field
          v-model="selectedPair"
          :values="formattedPairs"
          :key="selectedPair"
          class="trade__asset-selector-field"
        />
      </div>
      <div class="trade__asset-selector-balances">
        <p class="trade__asset-selector-balances-value">
          {{
            { value: balances.baseBalance, currency: assets.base } | formatMoney
          }}
          /
          {{
            {value: balances.quoteBalance, currency: assets.quote} | formatMoney
          }}
        </p>
        <p class="trade__asset-selector-balances-label">
          {{ 'trade.user-balances-label' | globalize }}
        </p>
      </div>
    </div>

    <div class="trade__chart" v-if="assets.base">
      <chart
        v-if="assets.base !== config.DEFAULT_QUOTE_ASSET"
        :base-asset="assets.base"
        :quote-asset="config.DEFAULT_QUOTE_ASSET"
      />
    </div>

    <trade-history
      v-if="assets.base"
      class="trade__history"
      :assets="assets"
      :trade-history="tradeHistory"
      :is-loading="isTradeHistoryLoading"
    />

    <div class="trade__orders">
      <h2 class="trade__orders-title">
        {{ 'trade.orders-section-title' | globalize }}
      </h2>
      <div class="trade__orders-wrapper">
        <trade-orders
          class="trade__orders-list"
          :assets="assets"
          :is-buy="true"
          :is-loading="isBuyOrdersLoading"
          :orders-list="buyOrdersList"
        />

        <trade-orders
          class="trade__orders-list"
          :assets="assets"
          :is-buy="false"
          :is-loading="isSellOrdersLoading"
          :orders-list="sellOrdersList"
          @reload-trades="reloadTradesData"
        />
      </div>
    </div>

    <drawer :is-shown.sync="isCreateBuyOrderDrawerShown">
      <template slot="heading">
        {{ 'trade.create-buy-order-form-title' | globalize }}
      </template>
      <create-trade-order-form
        :assets="assets"
        @close-drawer="closeBuyOrderDrawer"
      />
    </drawer>
    <drawer :is-shown.sync="isCreateSellOrderDrawerShown">
      <template slot="heading">
        {{ 'trade.create-sell-order-form-title' | globalize }}
      </template>
      <create-trade-order-form
        :assets="assets"
        :is-buy="false"
        @close-drawer="closeSellOrderDrawer"
      />
    </drawer>
  </div>
</template>

<script>
import CreateTradeOrderForm from '@/vue/forms/CreateTradeOrderForm'
import SelectField from '@/vue/fields/SelectField'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import Chart from '@/vue/common/chart/Chart'
import TradeHistory from '@/vue/pages/trade/Trade.History'
import TradeOrders from '@/vue/pages/trade/Trade.Orders'
import { ErrorHandler } from '@/js/helpers/error-handler'
import config from '@/config'
import { Sdk } from '@/sdk'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'

export default {
  name: 'trade',
  components: {
    CreateTradeOrderForm,
    SelectField,
    Drawer,
    TopBar,
    Chart,
    TradeHistory,
    TradeOrders,
  },
  data: () => ({
    isCreateBuyOrderDrawerShown: false,
    isCreateSellOrderDrawerShown: false,
    assets: {
      base: '',
      quote: '',
    },
    balances: {
      baseBalance: '',
      quoteBalance: '',
    },
    tradeHistory: [],
    selectedPair: '',
    tradeablePairs: [],
    formattedPairs: [],
    buyOrdersList: [],
    sellOrdersList: [],
    isTradeHistoryLoading: false,
    isBuyOrdersLoading: false,
    isSellOrdersLoading: false,
    config,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
    ]),
  },
  watch: {
    selectedPair (value) {
      const baseAsset = value.split('/')[0]
      const quoteAsset = value.split('/')[1]
      this.assets.base = baseAsset
      this.assets.quote = quoteAsset

      const accountBalances = this.accountBalances
      const baseBalance = accountBalances.find(i => i.asset === baseAsset)
      const quoteBalance = accountBalances.find(i => i.asset === quoteAsset)
      this.balances.baseBalance = baseBalance.balance
      this.balances.quoteBalance = quoteBalance.balance
    },
    assets: {
      deep: true,
      handler: function () {
        this.loadTradeOrders()
        this.loadTradeHistory()
      },
    },
  },
  created () {
    this.loadBalances()
    this.loadTradableAssets()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    reloadTradesData () {
      this.loadTradeOrders()
    },
    async loadTradableAssets () {
      try {
        const response = await Sdk.horizon.assetPairs.getAll()
        this.tradeablePairs = response.data
        this.createFormattedPairs(response.data)
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    async loadTradeHistory () {
      this.isTradeHistoryLoading = true
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
      this.isTradeHistoryLoading = false
    },
    createFormattedPairs (pairs) {
      const formattedPairs = pairs.map(item => {
        return `${item.base}/${item.quote}`
      })
      this.formattedPairs = formattedPairs
      if (formattedPairs.length) this.selectedPair = formattedPairs[0]
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
    closeBuyOrderDrawer () {
      this.isCreateBuyOrderDrawerShown = false
      this.loadBalances()
    },
    closeSellOrderDrawer () {
      this.isCreateSellOrderDrawerShown = false
      this.loadBalances()
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/mixins";
@import "~@scss/variables";

.trade__asset-selector-field {
  display: inline-block;
  width: auto;
}

.trade__asset-selector-balances {
  margin-top: 2.4rem;
}

.trade__asset-selector-balances-value {
  font-size: 2.8rem;
  font-weight: 400;
}

.trade__asset-selector-balances-label {
  font-size: 1.6rem;
  color: $col-text-secondary;
}

.trade__chart {
  margin-top: -2.4rem;
}

.trade__orders {
  margin-top: 4.8rem;
}

.trade__orders-title {
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 1.6rem;
}

.trade__orders-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.trade__orders-list {
  flex: 49%;

  &:not(:last-child) {
    margin-right: 1.6rem;
  }
}
</style>
