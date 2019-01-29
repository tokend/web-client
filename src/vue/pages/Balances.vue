<template>
  <div class="balances">
    <assets-list :assets="assets" />
  </div>
</template>

<script>
import AssetsList from '@/vue/common/assets/AssetsList'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'balances',
  components: {
    AssetsList,
  },
  data: _ => ({
    assets: [],
  }),
  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
    }),
  },
  created () {
    this.assets = this.accountBalances
      .map(balance => balance.assetDetails)
  },
}
</script>

<style lang="scss" scoped>

</style>
