<template>
  <div class="statistics">
    Statistics
  </div>
</template>

<script>
import config from '@/config'

export default {
  name: 'statistics',
  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
  }),
}
</script>

<style lang="scss">
</style>
