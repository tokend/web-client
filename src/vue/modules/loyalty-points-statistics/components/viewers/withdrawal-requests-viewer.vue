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
          label: 'Approved',
          value: this.withdrawalRequests
            .filter(item => item.isApproved)
            .length,
        },
        {
          label: 'Rejected',
          value: this.withdrawalRequests
            .filter(item => item.isRejected)
            .length,
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
