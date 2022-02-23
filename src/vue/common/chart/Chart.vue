<template>
  <div class="chart">
    <scale-tabs
      v-if="showTabs"
      class="chart__tabs"
      :class="{ 'chart__tabs--hidden': !(isActualData && historyHasValue) }"
      v-model="scale"
      :value="scale"
      :is-pending="isLoading"
    />
    <chart-renderer
      class="chart__renderer"
      :scale="scale"
      :has-value="isActualData && historyHasValue"
      :is-loading="isLoading"
      :is-ticks-shown="showTicks"
      :data="history"
      :precision="common.precision"
      :currency="quoteAsset"
    />
  </div>
</template>

<script>
import ChartRenderer from './Chart.Renderer'
import ScaleTabs from './Chart.Tabs'

import { errors } from '@tokend/js-sdk'
import { api } from '@/api'
import config from '@/config'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'chart',
  components: {
    ChartRenderer,
    ScaleTabs,
  },
  props: {
    baseAsset: { type: String, required: true },
    quoteAsset: { type: String, default: '' },
    initialScale: { type: String, default: 'day' },
    showTabs: { type: Boolean, default: true },
    showTicks: { type: Boolean, default: true },
  },
  data: () => ({
    data: {},
    isActualData: false,
    isLoading: false,
    scale: 'day',
    common: {
      precision: config.DECIMAL_POINTS,
    },
    loadPricesTickerIntervalId: -1,
  }),
  computed: {
    history () {
      if (!this.data[this.scale]) return []
      return this.data[this.scale]
    },
    historyHasValue () {
      let valueIsPresent = false
      this.history.map(item => {
        if (!valueIsPresent) {
          item.value > 0
            ? valueIsPresent = true
            : valueIsPresent = false
        }
      })
      return valueIsPresent
    },
    lockedAssets () {
      return { base: this.baseAsset, quote: this.quoteAsset }
    },
  },
  watch: {
    async lockedAssets (value) {
      this.createLoadPricesTicker()
      await this.loadPrices()
    },
  },
  async beforeDestroy () {
    this.clearLoadPricesTicker()
  },
  async created () {
    this.isLoading = true
    this.createLoadPricesTicker()
    await this.loadPrices()
    this.scale = this.initialScale
  },
  methods: {
    async createLoadPricesTicker () {
      this.clearLoadPricesTicker()
      this.loadPricesTickerIntervalId = setInterval(async () => {
        await this.loadPrices()
      }, config.RELOAD_DATA_TICKER_INTERVAL_MS)
    },
    async clearLoadPricesTicker () {
      clearInterval(this.loadPricesTickerIntervalId)
    },
    async loadPrices () {
      try {
        this.isActualData = true
        const response = this.quoteAsset
          ? await api.getRaw(
            `/charts/${this.lockedAssets.base}-${this.lockedAssets.quote}`,
          )
          : await api.getRaw(`/charts/${this.lockedAssets.base}`)
        this.data = response.data
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        if (error instanceof errors.NotFoundError) {
          this.isActualData = false
          this.data = {
            day: this.generateRandomData(),
            week: this.generateRandomData(),
            hour: this.generateRandomData(),
            month: this.generateRandomData(),
            year: this.generateRandomData(),
          }
        }
      }
      this.isLoading = false
    },
    generateRandomData () {
      return [{ value: '0', timestamp: new Date().toString() }]
    },
  },
}
</script>

<style lang="scss">
.chart {
  flex: 1;
}

.chart__tabs {
  margin-bottom: 6rem;
  display: flex;
  justify-content: flex-end;
  transition: all 0.25s;
}

.chart__tabs--hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
</style>
