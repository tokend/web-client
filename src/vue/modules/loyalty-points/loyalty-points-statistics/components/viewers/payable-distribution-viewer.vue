<template>
  <div class="payable-distribution-viewer">
    <pie-chart
      v-if="isLoaded"
      :data="distributionStatistics"
    />

    <p v-else-if="isLoadFailed">
      {{ 'payable-distribution-viewer.loading-error-msg' | globalize }}
    </p>

    <load-spinner
      v-else
      message-id="payable-distribution-viewer.loading-msg"
    />
  </div>
</template>

<script>
import PieChart from '../charts/pie-chart'
import LoadSpinner from '@/vue/common/Loader'

import payableDistributionMock from '../../mocks/payable-distribution'

import { ErrorHandler } from '@/js/helpers/error-handler'

const PIE_CHART_COLORS = [
  '#33a494',
  '#3a4180',
  '#7b6eff',
  '#ef5350',
  '#f2a100',
]

export default {
  name: 'payable-distribution-viewer',
  components: {
    PieChart,
    LoadSpinner,
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    payableDistribution: [],
  }),

  computed: {
    distributionStatistics () {
      const partnersCount = this.payableDistribution.length

      return this.payableDistribution
        .map((item, index) => {
          return {
            label: item.partner,
            value: item.amount,
            color: PIE_CHART_COLORS[index % partnersCount],
          }
        })
    },
  },

  created () {
    this.loadReceivableDistribution()
  },

  methods: {
    loadReceivableDistribution () {
      try {
        // TODO: load payable distribution from the API
        const { data } = payableDistributionMock
        this.payableDistribution = data
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>
