<template>
  <div class="document-explorer-page">
    <document-explorer-module
      :wallet="wallet"
      :config="config"
    />
  </div>
</template>

<script>
import DocumentExplorerModule from '@modules/document-explorer'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

export default {
  name: 'document-explorer-page',
  components: {
    DocumentExplorerModule,
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
