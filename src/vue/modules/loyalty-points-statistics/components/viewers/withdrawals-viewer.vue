<template>
  <div class="withdrawals-viewer">
    <line-chart
      v-if="isLoaded"
      id="withdrawals-chart"
      :data="withdrawals"
    />

    <load-spinner
      v-else-if="!isLoadFailed"
      message-id="loyalty-points.statistics.loading-msg"
    />

    <p v-else>
      {{ 'loyalty-points.statistics.loading-error-msg' | globalize }}
    </p>
  </div>
</template>

<script>
import LineChart from '../charts/line-chart'
import LoadSpinner from '@/vue/common/Loader'

import withdrawalsMock from '../../mocks/withdrawals'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'withdrawals-viewer',
  components: {
    LineChart,
    LoadSpinner,
  },

  data: _ => ({
    withdrawals: {},
    isLoaded: false,
  }),

  created () {
    this.loadWithdrawals()
  },

  methods: {
    loadWithdrawals () {
      try {
        // TODO: load withdrawals from the API
        const { data } = withdrawalsMock
        this.withdrawals = data
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>
