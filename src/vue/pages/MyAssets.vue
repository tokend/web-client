<template>
  <div class="my-assets-explorer">
    <my-assets-explorer-module
      :default-quote-asset="defaultQuoteAsset"
    />
  </div>
</template>

<script>
import MyAssetsExplorerModule from '@modules/assets/my-assets-explorer'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'my-assets-explorer-page',
  components: {
    MyAssetsExplorerModule,
  },

  computed: {
    ...mapGetters({
      defaultQuoteAsset: vuexTypes.defaultQuoteAsset,
    }),
  },
}
</script>
