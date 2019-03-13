<template>
  <div class="withdrawal-requests-viewer">
    <pie-chart id="requests-chart" :data="pieData" />
  </div>
</template>

<script>
import PieChart from '../charts/pie-chart'

import withdrawalRequestsMock from '../../mocks/withdrawal-requests'

import { WithdrawalRequest } from '../../wrappers/withdrawal-request'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { globalize } from '@/vue/filters/globalize'

export default {
  name: 'withdrawal-requests-viewer',
  components: {
    PieChart,
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    withdrawalRequests: [],
  }),

  computed: {
    pieData () {
      return [
        {
          label: globalize('loyalty-points.statistics.approved-request-label'),
          value: this.withdrawalRequests
            .filter(item => item.isApproved)
            .length,
          color: '#33a494',
        },
        {
          label: globalize('loyalty-points.statistics.rejected-request-label'),
          value: this.withdrawalRequests
            .filter(item => item.isRejected)
            .length,
          color: '#ef5350',
        },
      ]
    },
  },

  created () {
    this.loadWithdrawalRequests()
  },

  methods: {
    loadWithdrawalRequests () {
      try {
        const { data } = withdrawalRequestsMock
        this.withdrawalRequests = data
          .map(item => new WithdrawalRequest(item))
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>
