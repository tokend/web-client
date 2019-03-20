<template>
  <div class="statistics-page">
    <loyalty-points-statistics-module
      :config="config"
      :wallet="wallet"
    />
  </div>
</template>

<script>
import LoyaltyPointsStatisticsModule from '@modules/loyalty-points/loyalty-points-statistics'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'

import config from '@/config'

export default {
  name: 'statistics-page',
  components: {
    LoyaltyPointsStatisticsModule,
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
