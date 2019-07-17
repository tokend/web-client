<template>
  <div class="trade">
    <trade-top-bar @reload-trade-data="emitUpdateList('trade:updateList')" />
    <router-view />
  </div>
</template>

<script>
import TradeTopBar from '@/vue/common/TradeTopBar'
import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'trade',
  components: {
    TradeTopBar,
  },

  mixins: [UpdateList],

  beforeDestroy () {
    this.resetUpdateListEvent('trade:updateList')
  },
}
</script>

<style lang="scss">

</style>
