<template>
  <div class="summary-volume-viewer">
    <line-chart
      v-if="isLoaded"
      class="summary-volume-viewer__renderer"
      id="summary-volume-chart"
      :data="summaryVolumes"
      :currency="point"
    />
  </div>
</template>

<script>
import LineChart from '../charts/line-chart'

import summaryVolumesMock from '../../mocks/summary-volume'

import { ErrorHandler } from '@/js/helpers/error-handler'

const DEFAULT_POINT = 'PET'

export default {
  name: 'summary-volume-viewer',
  components: {
    LineChart,
  },

  data: _ => ({
    summaryVolumes: {},
    isLoaded: false,
    point: DEFAULT_POINT,
  }),

  created () {
    this.loadIncomingVolumes()
  },

  methods: {
    loadIncomingVolumes () {
      try {
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
