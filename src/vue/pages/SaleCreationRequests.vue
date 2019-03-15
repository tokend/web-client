<template>
  <div class="sale-creation-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(SaleCreationRequestsModule)"
      :submodule="getModule().getSubmodule(SaleCreationRequestsModule)"
      :wallet="wallet"
      :config="config"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { SaleCreationRequestsModule } from '@/vue/modules/requests/sale-creation-requests/module'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'sale-creation-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    SaleCreationRequestsModule,
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
