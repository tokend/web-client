<template>
  <div class="incoming-volume-viewer">
    <line-chart
      v-if="isLoaded"
      class="incoming-volume-viewer__renderer"
      id="incoming-volume-chart"
      :data="incomingVolumes"
      :currency="point"
    />
  </div>
</template>

<script>
import LineChart from '../charts/line-chart'

import incomingVolumesMock from '../../mocks/incoming-volume'

import { ErrorHandler } from '@/js/helpers/error-handler'

const DEFAULT_POINT = 'PET'

export default {
  name: 'incoming-volume-viewer',
  components: {
    LineChart,
  },

  data: _ => ({
    incomingVolumes: {},
    isLoaded: false,
    point: DEFAULT_POINT,
  }),

  created () {
    this.loadIncomingVolumes()
  },

  methods: {
    loadIncomingVolumes () {
      try {
        const { data } = incomingVolumesMock
        this.incomingVolumes = data
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>
