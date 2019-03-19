<template>
  <div>
    <loyalty-points-module
      :config="config"
      :wallet="wallet"
    />
  </div>
</template>

<script>
import config from '@/config'
import LoyaltyPointsModule from '@modules/loyalty-points'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'

export default {
  name: 'loyaly-points-page',
  components: {
    LoyaltyPointsModule,
  },
  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
  }),
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>

<style lang="scss">
</style>
