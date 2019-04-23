<template>
  <div class="receivable-payable-viewer">
    <line-chart
      v-if="isLoaded"
      :data="receivablePayable"
      :currency="point"
    />

    <p v-else-if="isLoadFailed">
      {{ 'receivable-payable-viewer.loading-error-msg' | globalize }}
    </p>

    <load-spinner
      v-else
      message-id="receivable-payable-viewer.loading-msg"
    />
  </div>
</template>

<script>
import LineChart from '../charts/line-chart'
import LoadSpinner from '@/vue/common/Loader'

import receivablePayableMock from '../../mocks/receivable-payable'

import { ErrorHandler } from '@/js/helpers/error-handler'

const DEFAULT_POINT = 'EUR'

export default {
  name: 'receivable-payable-viewer',
  components: {
    LineChart,
    LoadSpinner,
  },

  data: _ => ({
    receivablePayable: {},
    isLoaded: false,
    isLoadFailed: false,
    point: DEFAULT_POINT,
  }),

  created () {
    this.loadPayableReceivable()
  },

  methods: {
    loadPayableReceivable () {
      try {
        // TODO: load receivable-payable info from the API
        const { data } = receivablePayableMock
        this.receivablePayable = data
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>
