<template>
  <div class="sale-chart-container">
    <chart
      :base-asset="sale.baseAsset"
    />
  </div>
</template>

<script>
import Chart from 'L@/vue/app/common/chart/Chart'
import config from '@/config'

export default {
  name: 'sales-chart-tab',
  components: {
    Chart
  },
  props: {
    sale: { type: Object, default: undefined }
  },
  data: _ => ({
    config
  })
}
</script>

<style lang="scss">
</style>
