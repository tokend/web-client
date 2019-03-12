<template>
  <div class="document-manager">
    <document-manager-module
      :wallet="wallet"
      :config="config"
      :attached-account-id="id"
    />
  </div>
</template>

<script>
import DocumentManagerModule from '@modules/document-manager'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import config from '@/config'

export default {
  name: 'document-manager-page',
  components: {
    DocumentManagerModule,
  },
  props: {
    id: { type: String, required: true },
  },
  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
  }),
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>
