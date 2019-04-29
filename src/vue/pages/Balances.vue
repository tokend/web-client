<template>
  <div class="balance-explorer">
    <template v-if="getModule().canRenderSubmodule(BalanceExplorerModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(BalanceExplorerModule)"
        :storage-url="storageUrl"
        :wallet="wallet"
      />
    </template>
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { BalanceExplorerModule } from '@modules/assets/balance-explorer/module'

import config from '@/config'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'balances',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    BalanceExplorerModule,
    storageUrl: config.FILE_STORAGE,
  }),
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>
