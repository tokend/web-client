<template>
  <div class="document-explorer">
    <template v-if="isLoaded">
      <div
        v-if="documents.length"
        class="document-explorer__document-list"
      >
        <template v-for="document in documents">
          <router-link
            class="document-explorer__router-link"
            :key="document.key"
            :to="{
              name: vueRoutes.documentManager.name,
              params: { id: document.id } }
            "
          >
            <document-card-viewer :document="document" />
          </router-link>
        </template>
      </div>

      <no-data-message
        v-else
        icon-name="trending-up"
        :title="'document-explorer.no-documents-title' | globalize"
        :message="'document-explorer.no-documents-msg' | globalize"
      />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="document-explorer__error-msg">
        {{ 'document-explorer.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="document-explorer.loading-msg" />
    </template>
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import DocumentCardViewer from './components/document-card-viewer'
import DocumentsLoaderMixin from './mixins/documents-loader.mixin'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { vueRoutes } from '@/vue-router/routes'

const EVENTS = {
  shouldUpdate: 'update:shouldUpdate',
}

export default {
  name: 'document-explorer-module',
  components: {
    LoadSpinner,
    NoDataMessage,
    DocumentCardViewer,
  },
  mixins: [DocumentsLoaderMixin],

  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
    * @property config - the config for component to use
    * @property config.horizonURL - the url of horizon server (without version)
    */
    config: {
      type: Object,
      required: true,
    },
    shouldUpdate: {
      type: Boolean,
      default: false,
    },
  },

  data: _ => ({
    documents: [],
    isLoaded: false,
    isLoadFailed: false,

    vueRoutes,
  }),

  watch: {
    shouldUpdate: async function (value) {
      if (value) {
        await this.loadDocuments()
        this.$emit(EVENTS.shouldUpdate, false)
      }
    },
  },

  async created () {
    initApi(this.wallet, this.config)
    await this.loadDocuments()
  },

  methods: {
    async loadDocuments () {
      this.isLoaded = false
      this.documents = []

      try {
        const accounts = await this.loadPublicKeyEntries(this.wallet.accountId)
        this.documents = await this.getDocumentsByAccountIds(accounts)
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.document-explorer__document-list {
  display: flex;
  flex-wrap: wrap;
  margin: -1rem;
}

.document-explorer__router-link {
  width: 100%;
  display: block;
  text-decoration: none;
  max-width: 30rem;
}
</style>
