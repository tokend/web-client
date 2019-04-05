<template>
  <div class="asset-explorer">
    <template v-if="getModule().canRenderSubmodule(AssetExplorerModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(AssetExplorerModule)"
        :config="config"
        :wallet="wallet"
        :is-account-unverified="isAccountUnverified"
      />
    </template>
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { AssetExplorerModule } from '@modules/assets/asset-explorer/module'

import config from '../../config'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'assets-explorer',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    AssetExplorerModule,
    config: {
      horizonURL: config.HORIZON_SERVER,
      storageURL: config.FILE_STORAGE,
    },
  }),
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
      isAccountUnverified: vuexTypes.isAccountUnverified,
    }),
  },
}
</script>
