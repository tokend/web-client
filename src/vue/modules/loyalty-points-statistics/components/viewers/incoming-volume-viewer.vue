<template>
  <div class="incoming-volume-viewer">
    <line-chart
      v-if="isLoaded"
      id="incoming-volume-chart"
      :data="incomingVolumes"
      :currency="point"
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
import LineChart from '../charts/line-chart'
import LoadSpinner from '@/vue/common/Loader'

import incomingVolumesMock from '../../mocks/incoming-volume'

import { ErrorHandler } from '@/js/helpers/error-handler'

const DEFAULT_POINT = 'PET'

export default {
  name: 'incoming-volume-viewer',
  components: {
    LineChart,
    LoadSpinner,
  },

  data: _ => ({
    incomingVolumes: {},
    isLoaded: false,
    isLoadFailed: false,
    point: DEFAULT_POINT,
  }),

  created () {
    this.loadIncomingVolumes()
  },

  methods: {
    loadIncomingVolumes () {
      try {
        // TODO: load incoming volumes from the API
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
