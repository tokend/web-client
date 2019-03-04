<template>
  <div class="loyalty-points">
    Loyalty points
  </div>
</template>

<script>
import config from '@/config'

export default {
  name: 'loyaly-points',
  components: {
  },

  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
  }),

  computed: {
  },

  created () {
  },

  methods: {
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";
</style>
