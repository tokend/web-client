<template>
  <div class="asset-explorer">
    <balance-explorer-module
      :config="config"
      :wallet="wallet"
    />
  </div>
</template>

<script>
import BalanceExplorerModule from '@modules/assets/balance-explorer'

import config from '../../config'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'balances',
  components: {
    BalanceExplorerModule,
  },

  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
      storageURL: config.FILE_STORAGE,
    },
  }),
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>
