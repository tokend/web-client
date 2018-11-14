<template>
  <div class="chart-container">
    <div class="chart-container__main">
      <div class="chart-container__tabs">
        <scale-tabs
          :asset="asset"
          v-model="scale"
          :is-pending="isPending"
        />
      </div>

      <d3-chart
        :data="history"
        :currency="asset"
        :scale="scale"
        :is-pending="isPending"
        :precision="precision"
        v-if="history.length"
        :required-ticks="requiredTicks" />
      <!-- eslint-disable-next-line -->
      <p class="app__page-explanations app__page-explanations--secondary chart-container__loader" v-else>
        {{ i18n.market_price_chart_loading() }}
      </p>
    </div>
  </div>
</template>

<script>
import D3Chart from './ChartWidget.ChartRenderer'
import ScaleTabs from './ChartWidget.DateTabs'
import { i18n } from '../../../../../../js/i18n/index'
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../../../vuex/types'

export default {
  name: 'chart',

  components: {
    ScaleTabs,
    D3Chart
  },

  props: {
    data: { type: Object, required: true },
    asset: { type: String, default: '' },
    action: { type: String, default: 'issued' },
    currentCap: { type: [String, Number], default: '' },
    hardCap: { type: [String, Number], default: '' },
    softCap: { type: [String, Number], default: '' },
    precision: { type: Number, default: 0 }
  },

  data () {
    return {
      scale: 'month',
      isPending: false,
      i18n,
      tokenCode: null
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.userWithdrawableTokens,
      vuexTypes.accountBalances
    ]),
    tokenCodes () {
      return this.userWithdrawableTokens.map(token => token.code)
    },
    history () {
      if (!this.data[this.scale]) return []
      return this.data[this.scale]
    },
    requiredTicks () {
      return [this.softCap, this.hardCap].filter(value => value)
    },
    balance () {
      return this.accountBalances[this.tokenCode]
    }
  },

  created () {
    this.tokenCode = this.tokenCodes[0] || null
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../../../../scss/mixins";
  @import "../../../../../../scss/variables";

  p.chart-container__loader.app__page-explanations {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    min-width: 100%;
  }

  .chart-container__tabs {
    margin-bottom: 4.5 * $point;

    @include respond-to-custom(1000px) {
      flex-direction: column-reverse;
      align-items: flex-start;
    }
  }

  .chart-container__assets-select {
    @include respond-to-custom(1220px) {
      position: absolute;
      top: 8px;
      right: 30px;
    }
  }

  .chart-container__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0;
  }

  .chart-container__title {
    font-weight: bold;
    font-size: 1.6 * $point;
    color: $col-chart-tabs-title;
    opacity: 1;
    padding: 0;
    margin: 0 0 1 * $point 0;

    .chart-container__header &:first-child {
      margin-top: 0;
    }
  }
</style>
