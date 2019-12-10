<template>
  <div class="balance-explorer">
    <balance-explorer-module
      :default-quote-asset="defaultQuoteAsset"
    />
  </div>
</template>

<script>
import BalanceExplorerModule from '@modules/assets/balance-explorer'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'balances',
  components: {
    BalanceExplorerModule,
  },
  computed: {
    ...mapGetters({
      defaultQuoteAsset: vuexTypes.defaultQuoteAsset,
    }),
  },
}
</script>
