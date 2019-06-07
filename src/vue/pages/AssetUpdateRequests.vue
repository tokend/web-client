<template>
  <div class="asset-update-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(UpdateAssetRequestsModule)"
      :submodule="getModule().getSubmodule(UpdateAssetRequestsModule)"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { UpdateAssetRequestsModule } from '@/vue/modules/requests/update-asset-requests/module'

export default {
  name: 'asset-update-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    UpdateAssetRequestsModule,
  }),
}
</script>
