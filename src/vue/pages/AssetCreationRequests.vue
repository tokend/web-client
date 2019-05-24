<template>
  <div class="asset-creation-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(CreateAssetRequestsModule)"
      :submodule="getModule().getSubmodule(CreateAssetRequestsModule)"
      :kyc-required-asset-type="kvAssetTypeKycRequired"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { CreateAssetRequestsModule } from '@/vue/modules/requests/create-asset-requests/module'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'asset-creation-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    CreateAssetRequestsModule,
  }),

  computed: {
    ...mapGetters({
      kvAssetTypeKycRequired: vuexTypes.kvAssetTypeKycRequired,
    }),
  },
}
</script>
