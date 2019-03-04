<template>
  <div class="statistics">
    Statistics
  </div>
</template>

<script>
import config from '@/config'

export default {
  name: 'loyaly-points',
  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
    isSendRequestFormShown: false,
  }),
}
</script>

<style lang="scss">
</style>
