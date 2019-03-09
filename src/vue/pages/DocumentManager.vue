<template>
  <div class="document-manager">
    <div class="document-manager__inner">
      <div class="document-manager__document-viewer-wrp">
        <document-manager-module
          :wallet="wallet"
          :config="config"
          :attached-account-id="id"
        />
      </div>
      <div class="document-manager__document-signers-manager-wrp">
        <document-signers-manager-module
          :wallet="wallet"
          :config="config"
          :attached-account-id="id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DocumentManagerModule from '@modules/document-manager'
import DocumentSignersManagerModule from '@modules/document-signers-manager'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import config from '@/config'

export default {
  name: 'document-manager-page',
  components: {
    DocumentManagerModule,
    DocumentSignersManagerModule,
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

<style scoped>
.document-manager__inner {
  display: flex;
  justify-content: space-between;
}
.document-manager__document-signers-manager-wrp {
  width: 100%;
}
.document-manager__document-viewer-wrp {
  margin-right: 10rem;
}
</style>
