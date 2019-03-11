<template>
  <div class="document-explorer-page">
    <document-explorer-module
      :wallet="wallet"
      :config="config"
      :should-update.sync="shouldUpdate"
    />
  </div>
</template>

<script>
import DocumentExplorerModule from '@modules/document-explorer'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import config from '@/config'

const EVENTS = {
  documentUploaded: 'update:documentUploaded',
}

export default {
  name: 'document-explorer-page',
  components: {
    DocumentExplorerModule,
  },

  props: {
    documentUploaded: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      config: {
        horizonURL: config.HORIZON_SERVER,
        storageURL: config.FILE_STORAGE,
      },
      shouldUpdate: this.documentUploaded,
    }
  },

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },

  watch: {
    shouldUpdate: function (value) {
      this.$emit(EVENTS.documentUploaded, value)
    },

    documentUploaded: function (value) {
      this.shouldUpdate = value
    }
  },
}
</script>
