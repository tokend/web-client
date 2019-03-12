<template>
  <div class="withdrawals-viewer">
    <scale-tabs
      class="withdrawals-viewer__tabs"
      :class="{ 'withdrawals-viewer__tabs--hidden': !isActualData }"
      v-model="scale"
      :is-pending="isLoading"
    />

    <chart-renderer
      class="withdrawals-viewer__renderer"
      id="withdrawals-chart"
      :scale="scale"
      :has-value="isActualData"
      :is-loading="isLoading"
      :data="history"
      currency=" "
    />
  </div>
</template>

<script>
import ChartRenderer from '@/vue/common/chart/Chart.Renderer'
import ScaleTabs from '@/vue/common/chart/Chart.Tabs'

import withdrawals from '../../mocks/withdrawals'

export default {
  name: 'withdrawals-viewer',
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
      this.data = withdrawals
      this.isLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.withdrawals-viewer__tabs {
  margin-bottom: 6rem;
  display: flex;
  justify-content: flex-end;
  transition: all 0.25s;
}

.withdrawals-viewer__tabs--hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
</style>
