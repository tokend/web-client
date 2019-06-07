<template>
  <div class="sale-creation-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(CreateSaleRequestsModule)"
      :submodule="getModule().getSubmodule(CreateSaleRequestsModule)"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { CreateSaleRequestsModule } from '@/vue/modules/requests/create-sale-requests/module'

export default {
  name: 'sale-creation-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    CreateSaleRequestsModule,
  }),
}
</script>
