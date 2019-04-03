<template>
  <div class="trade-exchange">
    <div v-if="assetPair.base">
      <div class="trade-exchange__chart">
        <chart
          :base-asset="assetPair.base"
          :quote-asset="assetPair.quote"
        />
      </div>

      <div class="trade-exchange__offers">
        <h2 class="app__table-title">
          {{ 'trade-exchange.offers-section-title' | globalize }}
        </h2>
        <div class="trade-exchange__offers-wrapper">
          <trade-offers-renderer
            class="trade-exchange__offers-list"
            :asset-pair="assetPair"
            :is-buy="true"
            :is-loading="isBuyOffersLoading"
            :offers-list="buyOffersList"
            @reload-trades="reloadTrades"
          />

          <trade-offers-renderer
            class="trade-exchange__offers-list"
            :asset-pair="assetPair"
            :is-buy="false"
            :is-loading="isSellOffersLoading"
            :offers-list="sellOffersList"
            @reload-trades="reloadTrades"
          />
        </div>
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
            v-show="tradeHistory.length && !isTradeHistoryLoading"
            :first-page-loader="loadTradeHistory"
            :page-limit="recordsToShow"
            @first-page-load="setTradeHistory"
            @next-page-load="extendTradeHistory"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from '@/vue/common/chart/Chart'
import TradeHistoryRenderer from '@/vue/pages/TradeExchange/Trade.HistoryRenderer'
import TradeOffersRenderer from '@/vue/pages/TradeExchange/Trade.OffersRenderer'
import { ErrorHandler } from '@/js/helpers/error-handler'
import config from '@/config'
import { Sdk } from '@/sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import CollectionLoader from '@/vue/common/CollectionLoader'
import { mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'trade-exchange',
  components: {
    Chart,
    TradeHistoryRenderer,
    TradeOffersRenderer,
    CollectionLoader,
  },
  props: {
    isLoading: { type: Boolean, default: false },
  },
  data: () => ({
    tradeHistory: [],
    buyOffersList: [],
    sellOffersList: [],
    isTradeHistoryLoading: false,
    isBuyOffersLoading: false,
    isSellOffersLoading: false,
    recordsOrder: 'desc',
    recordsToShow: config.TRANSACTIONS_PER_PAGE,
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
    isLoading: async function () {
      await this.loadData()
      this.$emit('update:isLoading', false)
    },
  },
  async created () {
    this.setCurrentAssets(this.assetPair)
    if (this.assetPair.base) {
      await this.loadData()
    }
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async loadData () {
      this.isTradeHistoryLoading = true
      this.isBuyOffersLoading = true
      this.isSellOffersLoading = true

      await this.loadTradeOffers()
      await this.loadTradeHistory()
    },
    async loadTradeOffers () {
      await this.loadTradeBuyOffers()
      await this.loadTradeSellOffers()
    },
    async loadTradeHistory () {
      let response = await Sdk.horizon.trades.getPage({
        base_asset: this.assetPair.base,
        quote_asset: this.assetPair.quote,
        order_book_id: SECONDARY_MARKET_ORDER_BOOK_ID,
        order: this.recordsOrder,
        limit: this.recordsToShow,
      })
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
    async loadTradeBuyOffers () {
      try {
        const response = await Sdk.horizon.orderBook.getAll({
          base_asset: this.assetPair.base,
          quote_asset: this.assetPair.quote,
          is_buy: true,
        })
        this.buyOffersList = this.sortOffersList(response.data, 'ask')
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isBuyOffersLoading = false
    },
    async loadTradeSellOffers () {
      try {
        const response = await Sdk.horizon.orderBook.getAll({
          base_asset: this.assetPair.base,
          quote_asset: this.assetPair.quote,
          is_buy: false,
        })
        this.sellOffersList = this.sortOffersList(response.data, 'bids')
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isSellOffersLoading = false
    },
    setCurrentAssets (assetPair) {
      this.assetPair.base = assetPair.base
      this.assetPair.quote = assetPair.quote
    },
    async reloadTrades () {
      await this.loadData()
      await this.loadBalances()
    },
    sortOffersList (list, type) {
      return list.sort((a, b) => {
        if (parseFloat(a.price) > parseFloat(b.price)) {
          return (type === 'ask') ? -1 : 1
        } else if (parseFloat(a.price) < parseFloat(b.price)) {
          return (type === 'ask') ? 1 : -1
        } else {
          return 0
        }
      })
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

.trade-exchange__offers {
  margin-top: 1.6rem;
}

.trade-exchange__offers-wrapper {
  display: flex;
  align-items: flex-start;
  flex-basis: 50%;

  @include respond-to($custom-breakpoint) {
    flex-direction: column;
  }
}

.trade-exchange__offers-list {
  width: 50%;

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

.trade-exchange__history {
  margin-top: 4.8rem;
}

.trade-exchange__history-collection-loader {
  margin-top: 4.8rem;
  display: flex;
  justify-content: center;
}
</style>
