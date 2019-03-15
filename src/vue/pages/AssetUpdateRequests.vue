<template>
  <div class="asset-update-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(AssetUpdateRequestsModule)"
      :submodule="getModule().getSubmodule(AssetUpdateRequestsModule)"
      :wallet="wallet"
      :config="config"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { AssetUpdateRequestsModule } from '@/vue/modules/requests/asset-update-requests/module'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'asset-update-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    AssetUpdateRequestsModule,
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
