<template>
  <div class="document-explorer">
    <template v-if="isLoaded">
      <div
        v-if="documents.length"
        class="document-explorer__document-list"
      >
        <template v-for="document in documents">
          <document-card-viewer
            :document="document"
            :key="document.key"
          />
        </template>
      </div>

      <no-data-message
        v-else
        icon-name="trending-up"
        title-id="assets.no-balances-title"
        message-id="assets.no-balances-msg"
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

import DocumentCardViewer from './components/document-card-viewer'

// import { mapActions, mapMutations, mapGetters } from 'vuex'
// import { types } from './store/types'

import { Document } from './wrappers/document'

import { Wallet } from '@tokend/js-sdk'

import { initApi, api } from './_api'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'document-explorer-module',
  components: {
    LoadSpinner,
    DocumentCardViewer,
  },

  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
    * @property config - the config for component to use
    * @property config.horizonURL - the url of horizon server (without version)
    * @property config.storageURL - the url of storage server
    */
    config: {
      type: Object,
      required: true,
    },
  },

  data: _ => ({
    documents: [],
    isLoaded: false,
    isLoadFailed: false,
  }),

  async created () {
    initApi(this.wallet, this.config)
    await this.loadDocuments()
  },

  methods: {
    async loadDocuments () {
      try {
        const { data } = await api().getWithSignature(
          `/v3/public_key_entries/${this.wallet.accountId}`
        )

        const accounts = data.accounts
          .filter(item => item.id !== this.wallet.accountId)

        await Promise.all(accounts.map(async item => {
          const [blob, request] = await this.loadChangeRoleRequest(item.id)
          this.documents.push(new Document(request, blob))
        }))

        this.isLoaded = true
      } catch (e) {
        ErrorHandler.process(e)
      }
    },

    async loadChangeRoleRequest (accountId) {
      const limit = 1
      const order = 'desc'

      const { data } = await api().getWithSignature(`/v3/change_role_requests`, {
        filter: {
          requestor: accountId,
        },
        page: {
          limit,
          order,
        },
        include: ['request_details'],
      })

      const { data: blob } = await api().getWithSignature(
        `/accounts/${accountId}/blobs/${data[0].requestDetails.creatorDetails.blobId}`
      )

      return [blob, data[0]]
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
</style>
