<template>
  <div class="asset-creation-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(AssetCreationRequestsModule)"
      :submodule="getModule().getSubmodule(AssetCreationRequestsModule)"
      :wallet="wallet"
      :config="config"
      :kyc-required-asset-type="kvAssetTypeKycRequired"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { AssetCreationRequestsModule } from '@/vue/modules/requests/asset-creation-requests/module'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'asset-creation-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    AssetCreationRequestsModule,
    config: {
      horizonURL: config.HORIZON_SERVER,
      storageURL: config.FILE_STORAGE,
    },
  }),

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
      kvAssetTypeKycRequired: vuexTypes.kvAssetTypeKycRequired,
    }),
  },
}
</script>
