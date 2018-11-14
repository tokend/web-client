<template>
  <div class="trade">
    <asset-selector
      v-if="formattedPairs.length"
      :pairs="formattedPairs" />
    <div
      class="trade-row
             app__card-wrapper
             app__card-wrapper--xmedium-breakpoint">
      <chart
        :base-asset="filters.base"
        :quote-asset="filters.quote" />
      <trade-history
        :assets="filters"
        class="trade__history" />
    </div>

    <div class="md-layout">
      <orders class="md-layout-item md-size-100" />
    </div>

    <div class="md-layout">
      <trade-orders
        :assets="filters"
        class="md-layout-item md-size-100" />
    </div>

    <div class="md-layouts">
      <manage-orders
        :assets="filters"
        :offers="userOffers"
        class="md-layout-item md-size-100" />
    </div>
  </div>
</template>

<script>
import AssetSelector from './components/asset-selector/Trade.AssetSelector'
import Chart from 'L@/vue/app/common/chart/Chart'
import TradeHistory from './components/tradeHistory/Trade.TradeHistory'
import TradeOrders from './components/tradeOrders/Trade.TradeOrders'
import Orders from './components/orders/Trade.Orders'
import ManageOrders from './components/manageOrders/Trade.ManageOrders'

import { chartsService } from 'L@/js/services/charts.service'
import { errors } from 'L@/js/errors/factory'
import config from '@/config'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import { attachEventHandler } from 'L@/js/events/helpers'
import { commonEvents } from 'L@/js/events/common_events'
import { ErrorHandler } from 'L@/js/errors/error_handler'

export default {
  name: 'trade-index',
  components: {
    Chart,
    TradeHistory,
    TradeOrders,
    Orders,
    ManageOrders,
    AssetSelector
  },
  data: _ => ({
    history: {},
    tokenCode: '',
    filters: {
      base: '',
      quote: ''
    },
    common: {
      precision: config.DECIMAL_POINTS
    }
  }),
  computed: {
    ...mapGetters([
      vuexTypes.tradablePairs,
      vuexTypes.userOffers
    ]),
    formattedPairs () {
      return this.tradablePairs.map((el) => {
        return `${el.base}/${el.quote}`
      })
    }
  },
  async created () {
    await this.loadPairs()
    await this.loadData(this.tradablePairs[0])
    attachEventHandler(commonEvents.changePairsAsset, this.handleAssetChange)
    attachEventHandler(commonEvents.cancelOrder, this.handleCancelOrder)
    attachEventHandler(commonEvents.createdOrder, this.handleCreatedOffer)
  },
  methods: {
    ...mapActions({
      loadPairs: vuexTypes.GET_ASSET_PAIRS,
      loadOrders: vuexTypes.GET_SM_OFFERS,
      loadTrades: vuexTypes.GET_TRADES,
      loadUserOffers: vuexTypes.GET_USER_OFFERS
    }),
    async loadData (pair) {
      if (!pair) return
      await Promise.all([
        this.loadOrders(pair),
        this.loadPrices(pair),
        this.loadTrades(pair),
        this.loadUserOffers(pair)
      ])
    },
    async loadPrices ({ base, quote }) {
      try {
        this.history =
          (await chartsService.loadChartsForTokenPair(base, quote)).data()
      } catch (error) {
        if (error instanceof errors.NotFoundError) {
          console.error('error')
          ErrorHandler.processUnexpected(error)
        }
      }
    },
    handleAssetChange (payload) {
      this.filters.base = payload.split('/')[0]
      this.filters.quote = payload.split('/')[1]
      this.loadData(this.filters)
    },
    handleCancelOrder () {
      this.loadData(this.filters)
    },
    handleCreatedOffer () {
      this.loadData(this.filters)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  @import '~L@scss/mixins';
  $large-breakpoint: 1374px;
  $medium-breakpoint: 1374px;

  .transfer__success-msg {
    text-align: center;
  }

  .md-layout {
    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  .transfer__success-amount {
    color: $col-text-page-heading;
    font-size: 1.4rem;
    margin: 1rem 0 .5rem;
  }

  .trade-row {
    display: flex;
    margin-bottom: 1.5rem;
  }

  .trade__chart {
    @include respond-to-custom($large-breakpoint) {
      margin-bottom: 1.5rem;
    }
    @include respond-to-custom($medium-breakpoint) {
      margin-bottom: 0;
    }
  }
</style>
