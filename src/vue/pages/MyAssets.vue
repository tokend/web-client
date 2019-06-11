<template>
  <div class="my-assets-explorer">
    <template v-if="getModule().canRenderSubmodule(MyAssetsExplorerModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(MyAssetsExplorerModule)"
        :default-quote-asset="defaultQuoteAsset"
      />
    </template>
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { MyAssetsExplorerModule } from '@modules/assets/my-assets-explorer/module'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'my-assets-explorer-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    MyAssetsExplorerModule,
  }),

  computed: {
    ...mapGetters({
      defaultQuoteAsset: vuexTypes.defaultQuoteAsset,
    }),
  },
}
</script>
