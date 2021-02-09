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
            :update-offers-key="updateOffersKey"
            :is-buy="true"
            :is-loading="isBuyOffersLoading"
            :offers-list="buyOffersList"
            @reload-trades="emitUpdateList('trade:updateList')"
          />

          <trade-offers-renderer
            class="trade-exchange__offers-list"
            :asset-pair="assetPair"
            :update-offers-key="updateOffersKey"
            :is-buy="false"
            :is-loading="isSellOffersLoading"
            :offers-list="sellOffersList"
            @reload-trades="emitUpdateList('trade:updateList')"
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
            :ref="REFS.tradeHistory"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TradeHistoryRenderer from '@/vue/pages/TradeExchange/Trade.HistoryRenderer'
import TradeOffersRenderer from '@/vue/pages/TradeExchange/Trade.OffersRenderer'
import CollectionLoader from '@/vue/common/CollectionLoader'
import UpdateList from '@/vue/mixins/update-list.mixin'
import Chart from '@/vue/common/chart/Chart'
import config from '@/config'

import { OrderBookRecord } from '@/js/records/entities/order-book.record'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapActions } from 'vuex'
import { api } from '@/api'

const REFS = {
  tradeHistory: 'trade-history',
}

export default {
  name: 'trade-exchange',
  components: {
    Chart,
    TradeHistoryRenderer,
    TradeOffersRenderer,
    CollectionLoader,
  },
  mixins: [UpdateList],
  data: () => ({
    tradeHistory: [],
    buyOffersList: [],
    sellOffersList: [],
    isTradeHistoryLoading: false,
    isBuyOffersLoading: false,
    isSellOffersLoading: false,
    recordsOrder: 'desc',
    recordsToShow: config.TRANSACTIONS_PER_PAGE,

    loadTradeDataTickerIntervalId: -1,
    updateOffersKey: 0,
    REFS,
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
      handler: async function (assetPair) {
        this.setCurrentAssets(assetPair)
        if (assetPair.base && assetPair.quote) {
          await this.loadTradeOffers()
          this.createLoadTradeDataTicker()
        }
      },
    },
  },
  async created () {
    this.isBuyOffersLoading = true
    this.isSellOffersLoading = true
    this.isTradeHistoryLoading = true
    this.setCurrentAssets(this.assetPair)
    if (this.assetPair.base) {
      await this.loadTradeOffers()
      this.createLoadTradeDataTicker()
    }
    this.listenUpdateList('trade:updateList', this.reloadTrades)
  },

  beforeDestroy () {
    this.clearLoadTradeDataTicker()
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async createLoadTradeDataTicker () {
      this.clearLoadTradeDataTicker()
      this.loadTradeDataTickerIntervalId = setInterval(async () => {
        await this.loadTradeOffers()
        this.updateOffersKey = +new Date()
      }, config.RELOAD_DATA_TICKER_INTERVAL_MS)
    },
    async clearLoadTradeDataTicker () {
      clearInterval(this.loadTradeDataTickerIntervalId)
    },
    async loadTradeOffers () {
      try {
        const baseAsset = this.assetPair.base
        const quoteAsset = this.assetPair.quote
        const orderBookId = SECONDARY_MARKET_ORDER_BOOK_ID

        const endpoint = `/v3/order_books/${baseAsset}:${quoteAsset}:${orderBookId}`
        const { data } = await api.get(endpoint, {
          include: ['buy_entries', 'sell_entries'],
        })
        let orderBook = new OrderBookRecord(data)

        this.buyOffersList = this.sortOffersList(orderBook.buyEntries, 'ask')
        this.sellOffersList = this.sortOffersList(orderBook.sellEntries, 'bids')
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isBuyOffersLoading = false
      this.isSellOffersLoading = false
    },
    async loadTradeHistory () {
      const params = {
        filter: {
          base_asset: this.assetPair.base,
          quote_asset: this.assetPair.quote,
        },
        page: {
          limit: this.recordsToShow,
          order: this.recordsOrder,
        },
      }
      let response
      try {
        response = await api.get('/v3/matches', params)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isTradeHistoryLoading = false
      return response
    },
    setTradeHistory (data) {
      this.tradeHistory = data
    },
    extendTradeHistory (data) {
      this.tradeHistory = this.tradeHistory.concat(data)
    },
    setCurrentAssets (assetPair) {
      this.assetPair.base = assetPair.base
      this.assetPair.quote = assetPair.quote
    },
    async reloadTrades () {
      await this.reloadData()
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

    async reloadData () {
      await this.loadTradeOffers()
      this.reloadCollectionLoader()
    },

    reloadCollectionLoader () {
      return this.$refs[REFS.tradeHistory].loadFirstPage()
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

$media-custom-breakpoint: 985px;

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

  @include respond-to($media-custom-breakpoint) {
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

  @include respond-to($media-custom-breakpoint) {
    flex-direction: column;
  }
}

.trade-exchange__offers-list {
  width: 50%;

  @include respond-to($media-custom-breakpoint) {
    max-width: 100%;
    width: 100%;
  }

  &:not(:last-child) {
    margin-right: 1.6rem;

    @include respond-to($media-custom-breakpoint) {
      margin-right: 0;
      margin-bottom: 1.6rem;
    }
  }
}

.trade-exchange__history {
  margin-top: 4.8rem;
}

.trade-exchange__history-collection-loader {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
</style>
