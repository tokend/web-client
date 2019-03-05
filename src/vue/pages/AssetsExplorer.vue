<template>
  <div class="asset-explorer">
    <asset-explorer-module
      :config="config"
      :wallet="wallet"
    />
  </div>
</template>

<script>
import AssetExplorerModule from '@modules/assets/asset-explorer'

import config from '../../config'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'assets-explorer',
  components: {
    AssetExplorerModule,
  },

  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
      storageURL: config.FILE_STORAGE,
    },
  }),
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>
