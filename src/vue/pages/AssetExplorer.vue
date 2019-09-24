<template>
  <div class="asset-explorer">
    <template v-if="getModule().canRenderSubmodule(AssetExplorerModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(AssetExplorerModule)"
      />
    </template>
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { AssetExplorerModule } from '@modules/assets/asset-explorer/module'

export default {
  name: 'assets-explorer',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    AssetExplorerModule,
  }),
}
</script>
