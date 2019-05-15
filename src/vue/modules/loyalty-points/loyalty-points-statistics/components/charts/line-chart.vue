<template>
  <div class="line-chart">
    <scale-tabs
      class="line-chart__tabs"
      v-model="scale"
    />

    <chart-renderer
      class="line-chart__renderer"
      :scale="scale"
      :data="history"
      :currency="currency"
    />
  </div>
</template>

<script>
import ChartRenderer from '@/vue/common/chart/Chart.Renderer'
import ScaleTabs from '@/vue/common/chart/Chart.Tabs'

export default {
  name: 'line-chart',
  components: {
    ChartRenderer,
    ScaleTabs,
  },

  props: {
    data: { type: Object, default: _ => ({}) },
    currency: { type: String, default: ' ' },
  },

  data: _ => ({
    scale: 'year',
  }),

  computed: {
    history () {
      return this.data[this.scale] || []
    },
  },
}
</script>

<style lang="scss" scoped>
.line-chart {
  flex: 1;
}

.line-chart__tabs {
  margin-bottom: 6rem;
  display: flex;
  justify-content: flex-end;
  transition: all 0.25s;
}
</style>
