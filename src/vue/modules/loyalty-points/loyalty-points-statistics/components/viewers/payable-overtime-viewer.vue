<template>
  <div class="payable-overtime-viewer">
    <line-chart
      v-if="isLoaded"
      id="payable-overtime-chart"
      :data="payableOvertime"
      :currency="point"
    />

    <p v-else-if="isLoadFailed">
      {{ 'payable-overtime-viewer.loading-error-msg' | globalize }}
    </p>

    <load-spinner
      v-else
      message-id="payable-overtime-viewer.loading-msg"
    />
  </div>
</template>

<script>
import LineChart from '../charts/line-chart'
import LoadSpinner from '@/vue/common/Loader'

import payableOvertimeMock from '../../mocks/payable-overtime'

import { ErrorHandler } from '@/js/helpers/error-handler'

const DEFAULT_POINT = 'PET'

export default {
  name: 'payable-overtime-viewer',
  components: {
    LineChart,
    LoadSpinner,
  },

  data: _ => ({
    payableOvertime: {},
    isLoaded: false,
    isLoadFailed: false,
    point: DEFAULT_POINT,
  }),

  created () {
    this.loadPayableOvertime()
  },

  methods: {
    loadPayableOvertime () {
      try {
        // TODO: load payable overtime from the API
        const { data } = payableOvertimeMock
        this.payableOvertime = data
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>
