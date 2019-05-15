<template>
  <div class="balance-explorer">
    <template v-if="getModule().canRenderSubmodule(BalanceExplorerModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(BalanceExplorerModule)"
        :storage-url="storageUrl"
        :default-quote-asset="defaultQuoteAsset"
      />
    </template>
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { BalanceExplorerModule } from '@modules/assets/balance-explorer/module'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

import config from '@/config'

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
      defaultQuoteAsset: vuexTypes.defaultQuoteAsset,
    }),
  },
}
</script>
