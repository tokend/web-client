<template>
  <div class="statistics-page">
    <loyalty-points-statistics-module/>
  </div>
</template>

<script>
import LoyaltyPointsStatisticsModule from '@modules/loyalty-points/loyalty-points-statistics'

export default {
  name: 'statistics-page',
  components: {
    LoyaltyPointsStatisticsModule,
  },
}
</script>
