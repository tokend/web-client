<template>
  <div class="trade">
    <trade-top-bar @reload-trade-data="isTradesLoading = true" />
    <router-view :is-loading.sync="isTradesLoading" />
  </div>
</template>

<script>
import TradeTopBar from '@/vue/common/TradeTopBar'

export default {
  name: 'trade',
  components: {
    TradeTopBar,
  },
  data: _ => ({
    isTradesLoading: false,
  }),
}
</script>

<style lang="scss">

</style>
