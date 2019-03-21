<template>
  <div class="withdrawals-statistics-viewer">
    <line-chart
      v-if="isLoaded"
      id="withdrawals-chart"
      :data="withdrawals"
    />

    <p v-else-if="isLoadFailed">
      {{ 'withdrawals-statistics-viewer.loading-error-msg' | globalize }}
    </p>

    <load-spinner
      v-else
      message-id="withdrawals-statistics-viewer.loading-msg"
    />
  </div>
</template>

<script>
import LineChart from '../charts/line-chart'
import LoadSpinner from '@/vue/common/Loader'

import withdrawalsMock from '../../mocks/withdrawals'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'withdrawals-statistics-viewer',
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
