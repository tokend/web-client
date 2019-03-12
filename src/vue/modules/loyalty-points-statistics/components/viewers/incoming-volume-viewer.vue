<template>
  <div class="incoming-volume-viewer">
    <scale-tabs
      class="incoming-volume-viewer__tabs"
      :class="{ 'incoming-volume-viewer__tabs--hidden': !isActualData }"
      v-model="scale"
      :is-pending="isLoading"
    />
    <chart-renderer
      class="incoming-volume-viewer__renderer"
      id="incoming-volume-chart"
      :scale="scale"
      :has-value="isActualData"
      :is-loading="isLoading"
      :data="history"
      currency="PET"
    />
  </div>
</template>

<script>
import ChartRenderer from '@/vue/common/chart/Chart.Renderer'
import ScaleTabs from '@/vue/common/chart/Chart.Tabs'

import incomingVolumes from '../../mocks/incoming-volume'

export default {
  name: 'incoming-volume-viewer',
  components: {
    ChartRenderer,
    ScaleTabs,
  },

  data: _ => ({
    data: {},
    isActualData: false,
    isLoading: false,
    scale: 'month',
  }),

  computed: {
    history () {
      return this.data[this.scale] || []
    },
  },

  created () {
    this.loadData()
  },

  methods: {
    loadData () {
      this.isLoading = true
      this.isActualData = true
      this.data = incomingVolumes
      this.isLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.incoming-volume-viewer__tabs {
  margin-bottom: 6rem;
  display: flex;
  justify-content: flex-end;
  transition: all 0.25s;
}

.incoming-volume-viewer__tabs--hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
</style>
