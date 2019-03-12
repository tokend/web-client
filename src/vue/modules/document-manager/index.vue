<template>
  <div class="document-manager">
    <div class="document-manager__inner" v-if="metadata && downloadLink">
      <div class="document-manager__viewer-wrp">
        <div class="document-manager__file-attributes-wrp">
          <file-attributes-viewer
            :metadata="metadata"
            :download-link="downloadLink"
          />
        </div>
        <div class="document-manager__state-checker-wrp">
          <state-checker
            :file-key="metadata.fileKey"
            :file-hash="metadata.fileHash"
            :file-mime-type="metadata.fileMimeType"
          />
        </div>
        <div class="document-manager__description-viewer-wrp">
          <description-viewer :description="metadata.description" />
        </div>
      </div>
      <div class="document-manager__signers-manager-wrp">
        <signers-manager-module
          :config="config"
          :wallet="wallet"
          :source-account-id="attachedAccountId"
        />
      </div>
    </div>

    <load-spinner
      v-else-if="isLoading"
      message-id="document-manager.loading-msg"
    />

    <p v-else class="document-manager__loading-failed-msg">
      <template v-if="isUnauthorized">
        {{ 'document-manager.document-not-allowed-msg' | globalize }}
      </template>
      <template v-else-if="isNotFound">
        {{ 'document-manager.document-not-found-msg' | globalize }}
      </template>
      <template v-else>
        {{ 'document-manager.loading-failed-msg' | globalize }}
      </template>
    </p>
  </div>
</template>

<script>
import DescriptionViewer from './components/description-viewer'
import FileAttributesViewer from './components/file-attributes-viewer'
import StateChecker from './components/state-checker'

import SignersManagerModule from './modules/signers-manager'

import LoadSpinner from '@/vue/common/Loader'

import { Wallet } from '@tokend/js-sdk'
import { initApi, api } from './_api'
import { Metadata } from './wrappers/metadata'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@/js/errors'

import { REQUEST_STATES } from '@/js/const/request-states.const'

export default {
  name: 'document-manager-module',
  components: {
    DescriptionViewer,
    FileAttributesViewer,
    StateChecker,

    SignersManagerModule,

    LoadSpinner,
  },
  props: {
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
    wallet: {
      type: Wallet,
      required: true,
    },
    attachedAccountId: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    metadata: null,
    downloadLink: null,

    isLoading: false,
    isUnauthorized: false,
    isNotFound: false,
  }),
  async created () {
    initApi(this.wallet, this.config)
    await this.loadDocument()
  },
  methods: {
    async loadDocument () {
      this.isLoading = true
      try {
        this.metadata = await this.getMetadata()
        this.downloadLink = await this.getDownloadLink(this.metadata.fileKey)
      } catch (e) {
        switch (e.constructor) {
          case errors.UnauthorizedError:
            this.isUnauthorized = true
            break
          case errors.NotFoundError:
            this.isNotFound = true
            break
          default:
            ErrorHandler.processWithoutFeedback(e)
        }
      }
      this.isLoading = false
    },
    async getMetadata () {
      const blobId = await this.getBlobId()
      const blob = await this.getBlob(blobId)

      const rawMetadata = JSON.parse(blob)

      return new Metadata(rawMetadata)
    },
    async getBlobId () {
      const { data: changeRoleRequests } = await api().getWithSignature(`/v3/change_role_requests`, {
        include: ['request_details'],
        filter: {
          state: REQUEST_STATES.approved,
          requestor: this.attachedAccountId,
        },
        page: {
          order: 'desc',
        },
      })

      if (!changeRoleRequests[0]) {
        throw new errors.NotFoundError()
      }

      return changeRoleRequests[0].requestDetails.creatorDetails.blobId
    },
    async getBlob (blobId) {
      // TODO: legacy endpoint, new one currently has problems with sign check
      const endpoint = `/accounts/${this.attachedAccountId}/blobs/${blobId}`
      const { data } = await api().getWithSignature(endpoint)

      return data.value
    },
    async getDownloadLink (fileKey) {
      const { data: { url } } = await api().getWithSignature(`/documents/${fileKey}`)
      return url
    },
  },
}
</script>

<style lang="scss" scoped>
.document-manager {
  &__inner {
    display: flex;
    justify-content: space-between;
  }

  &__viewer-wrp {
    width: 100%;
    max-width: 55rem;
    margin-right: 10rem;
  }

  &__signers-manager-wrp {
    width: 100%;
  }

  &__file-attributes-wrp { margin-bottom: 1.5rem }
  &__state-checker-wrp { margin-bottom: 3rem }
}
</style>
