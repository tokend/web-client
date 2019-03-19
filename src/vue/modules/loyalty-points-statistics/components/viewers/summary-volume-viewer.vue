<template>
  <div class="summary-volume-viewer">
    <line-chart
      v-if="isLoaded"
      id="summary-volume-chart"
      :data="summaryVolumes"
      :currency="point"
    />

    <p v-else-if="isLoadFailed">
      {{ 'summary-volume-viewer.loading-error-msg' | globalize }}
    </p>

    <load-spinner
      v-else
      message-id="summary-volume-viewer.loading-msg"
    />
  </div>
</template>

<script>
import LineChart from '../charts/line-chart'
import LoadSpinner from '@/vue/common/Loader'

import summaryVolumesMock from '../../mocks/summary-volume'

import { ErrorHandler } from '@/js/helpers/error-handler'

const DEFAULT_POINT = 'PET'

export default {
  name: 'summary-volume-viewer',
  components: {
    LineChart,
    LoadSpinner,
  },

  data: _ => ({
    summaryVolumes: {},
    isLoaded: false,
    isLoadFailed: false,
    point: DEFAULT_POINT,
  }),

  created () {
    this.loadSummaryVolumes()
  },

  methods: {
    loadSummaryVolumes () {
      try {
        // TODO: load summary volumes from the API
        const { data } = summaryVolumesMock
        this.summaryVolumes = data
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>
