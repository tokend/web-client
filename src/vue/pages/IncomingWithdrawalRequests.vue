<template>
  <div class="asset-creation-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(IncomingWithdrawalRequestsModule)"
      :submodule="getModule().getSubmodule(IncomingWithdrawalRequestsModule)"
      :wallet="wallet"
      :config="config"
      :kyc-required-asset-type="kvAssetTypeKycRequired"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { IncomingWithdrawalRequestsModule } from '@/vue/modules/requests/incoming-withdrawal-requests/module'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'incoming-withdrawal-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    IncomingWithdrawalRequestsModule,
    config: {
      horizonURL: config.HORIZON_SERVER,
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
