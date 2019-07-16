<template>
  <div class="trade">
    <trade-top-bar @reload-trade-data="updateList()" />
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
}
</script>

<style lang="scss">

</style>
