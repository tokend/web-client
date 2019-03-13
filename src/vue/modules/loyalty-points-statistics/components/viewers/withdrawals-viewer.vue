<template>
  <div class="withdrawals-viewer">
    <line-chart
      v-if="isLoaded"
      id="withdrawals-chart"
      :data="withdrawals"
    />
  </div>
</template>

<script>
import LineChart from '../charts/line-chart'

import withdrawalsMock from '../../mocks/withdrawals'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'withdrawals-viewer',
  components: {
    LineChart,
  },

  data: _ => ({
    withdrawals: {},
    isLoaded: false,
  }),

  created () {
    this.loadIncomingVolumes()
  },

  methods: {
    loadIncomingVolumes () {
      try {
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
