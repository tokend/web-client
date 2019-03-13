<template>
  <div class="withdrawal-requests-viewer">
    <!-- <donut-chart
      :percent="percent"
      foreground-color="#7b6eff"
      background-color="#c1bfd0"
      :stroke-width="20"
    /> -->

    <pie-chart id="requests-chart" />
  </div>
</template>

<script>
// import DonutChart from '../donut-chart'
import PieChart from '../pie-chart'

export default {
  name: 'withdrawal-requests-viewer',
  components: {
    // DonutChart,
    PieChart,
  },

  data: _ => ({
    percent: 75,
  }),
}
</script>
