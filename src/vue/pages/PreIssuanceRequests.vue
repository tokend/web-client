<template>
  <div class="pre-issuance-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(PreIssuanceRequestsModule)"
      :submodule="getModule().getSubmodule(PreIssuanceRequestsModule)"
      :wallet="wallet"
      :config="config"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { PreIssuanceRequestsModule } from '@/vue/modules/requests/pre-issuance-requests/module'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'pre-issuance-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    PreIssuanceRequestsModule,
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
  }),

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>
