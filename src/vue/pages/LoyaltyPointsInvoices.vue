<template>
  <div>
    <loyalty-points-invoices-module
      :config="config"
      :wallet="wallet"
    />
  </div>
</template>

<script>
import config from '@/config'
import LoyaltyPointsInvoicesModule from '@modules/loyalty-points-invoices'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'

export default {
  name: 'loyalty-points-invoices-page',
  components: {
    LoyaltyPointsInvoicesModule,
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
