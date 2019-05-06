<template>
  <div class="receivable-distribution-viewer">
    <pie-chart
      v-if="isLoaded"
      :data="distributionStatistics"
    />

    <p v-else-if="isLoadFailed">
      {{ 'receivable-distribution-viewer.loading-error-msg' | globalize }}
    </p>

    <load-spinner
      v-else
      message-id="receivable-distribution-viewer.loading-msg"
    />
  </div>
</template>

<script>
import PieChart from '../charts/pie-chart'
import LoadSpinner from '@/vue/common/Loader'

import receivableDistributionMock from '../../mocks/receivable-distribution'

import { ErrorHandler } from '@/js/helpers/error-handler'

const PIE_CHART_COLORS = [
  '#3a4180',
  '#33a494',
  '#ef5350',
  '#7b6eff',
  '#f2a100',
]

export default {
  name: 'receivable-distribution-viewer',
  components: {
    PieChart,
    LoadSpinner,
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    receivableDistribution: [],
  }),

  computed: {
    distributionStatistics () {
      const partnersCount = this.receivableDistribution.length

      return this.receivableDistribution
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
        // TODO: load receivable distribution from the API
        const { data } = receivableDistributionMock
        this.receivableDistribution = data
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>
