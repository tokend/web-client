<template>
  <div class="receivable-overtime-viewer">
    <line-chart
      v-if="isLoaded"
      id="receivable-overtime-chart"
      :data="receivableOvertime"
      :currency="point"
    />

    <p v-else-if="isLoadFailed">
      {{ 'receivable-overtime-viewer.loading-error-msg' | globalize }}
    </p>

    <load-spinner
      v-else
      message-id="receivable-overtime-viewer.loading-msg"
    />
  </div>
</template>

<script>
import LineChart from '../charts/line-chart'
import LoadSpinner from '@/vue/common/Loader'

import receivableOvertimeMock from '../../mocks/receivable-overtime'

import { ErrorHandler } from '@/js/helpers/error-handler'

const DEFAULT_POINT = 'PET'

export default {
  name: 'receivable-overtime-viewer',
  components: {
    LineChart,
    LoadSpinner,
  },

  data: _ => ({
    receivableOvertime: {},
    isLoaded: false,
    isLoadFailed: false,
    point: DEFAULT_POINT,
  }),

  created () {
    this.loadReceivableOvertime()
  },

  methods: {
    loadReceivableOvertime () {
      try {
        // TODO: load receivable overtime from the API
        const { data } = receivableOvertimeMock
        this.receivableOvertime = data
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>
