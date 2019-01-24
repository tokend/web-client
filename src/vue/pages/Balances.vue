<template>
  <div class="balances">
    <tokens-list :tokens="tokens" />
  </div>
</template>

<script>
import TokensList from '@/vue/common/TokensList'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'balances',
  components: {
    TokensList,
  },
  data: _ => ({
    tokens: [],
  }),
  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
    }),
  },
  created () {
    this.tokens = this.accountBalances.map(balance => balance.assetDetails)
  },
}
</script>

<style lang="scss" scoped>

</style>
