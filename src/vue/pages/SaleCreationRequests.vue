<template>
  <div class="sale-creation-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(CreateSaleRequestsModule)"
      :submodule="getModule().getSubmodule(CreateSaleRequestsModule)"
      :storage-url="storageUrl"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { CreateSaleRequestsModule } from '@/vue/modules/requests/create-sale-requests/module'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'sale-creation-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    CreateSaleRequestsModule,
    storageUrl: config.FILE_STORAGE,
  }),

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>
