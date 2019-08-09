<template>
  <div class="my-assets-explorer">
    <template v-if="getModule().canRenderSubmodule(MyAssetsExplorerModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(MyAssetsExplorerModule)"
      />
    </template>
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { MyAssetsExplorerModule } from '@modules/assets/my-assets-explorer/module'

export default {
  name: 'my-assets-explorer-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    MyAssetsExplorerModule,
  }),
}
</script>
