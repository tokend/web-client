<template>
  <div>
    <loyalty-points-invoices-module
      :horizon-url="horizonUrl"
    />
  </div>
</template>

<script>
import config from '@/config'
import LoyaltyPointsInvoicesModule from '@modules/loyalty-points/loyalty-points-invoices'

export default {
  name: 'loyalty-points-invoices-page',
  components: {
    LoyaltyPointsInvoicesModule,
  },
  data: _ => ({
    horizonUrl: config.HORIZON_SERVER
  }),
}
</script>

<style lang="scss">
</style>
