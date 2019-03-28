<template>
  <div class="balance-explorer">
    <template v-if="getModule().canRenderSubmodule(BalanceExplorerModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(BalanceExplorerModule)"
        :config="config"
        :wallet="wallet"
        :kyc-required-asset-type="kycRequiredAssetType"
      />
    </template>
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { BalanceExplorerModule } from '@modules/assets/balance-explorer/module'

import config from '../../config'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'balances',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    BalanceExplorerModule,
    config: {
      horizonURL: config.HORIZON_SERVER,
      storageURL: config.FILE_STORAGE,
    },
  }),
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
      kycRequiredAssetType: vuexTypes.kvAssetTypeKycRequired,
    }),
  },
}
</script>
