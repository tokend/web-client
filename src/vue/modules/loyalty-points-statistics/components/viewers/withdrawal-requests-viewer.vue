<template>
  <div class="withdrawal-requests-viewer">
    <pie-chart
      v-if="isLoaded"
      id="requests-chart"
      :data="requestsStatistics"
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
import PieChart from '../charts/pie-chart'
import LoadSpinner from '@/vue/common/Loader'

import withdrawalRequestsMock from '../../mocks/withdrawal-requests'

import { WithdrawalRequest } from '../../wrappers/withdrawal-request'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { globalize } from '@/vue/filters/globalize'

const COLORS = {
  green: '#33a494',
  red: '#ef5350',
}

export default {
  name: 'withdrawal-requests-viewer',
  components: {
    PieChart,
    LoadSpinner,
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    withdrawalRequests: [],
  }),

  computed: {
    requestsStatistics () {
      // globalize is used inside the component because pie chart renders
      // labels programmatically, not using the template, so we need to
      // translate them before passing.
      return [
        {
          label: globalize('loyalty-points.statistics.approved-request-label'),
          value: this.withdrawalRequests
            .filter(item => item.isApproved)
            .length,
          color: COLORS.green,
        },
        {
          label: globalize('loyalty-points.statistics.rejected-request-label'),
          value: this.withdrawalRequests
            .filter(item => item.isRejected)
            .length,
          color: COLORS.red,
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
        // TODO: load withdrawal requests from the API
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
