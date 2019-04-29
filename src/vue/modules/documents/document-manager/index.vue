<template>
  <div class="document-manager">
    <div
      v-if="signer && downloadLink && !isLoading"
      class="document-manager__inner"
    >
      <!--TODO: rename-->
      <div class="document-manager__right-section-wrp">
        <div class="document-manager__file-preview-wrp">
          <div class="document-manager__header">
            <h2>{{ 'document-manager.file-preview-title' | globalize }}</h2>
          </div>

          <file-preview
            :download-link="downloadLink"
            :mime-type="metadata.fileMimeType"
          />
        </div>
        <div class="document-manager__signers-manager-wrp">
          <signers-manager-module
            :source-account-id="attachedAccountId"
          />
        </div>
      </div>

      <div class="document-manager__document-info-wrp">
        <div class="document-manager__header">
          <h2>{{ 'document-manager.document-info-title' | globalize }}</h2>
        </div>
        <div class="document-manager__document-uploader-viewer-wrp">
          <document-uploader-viewer
            :metadata="metadata"
          />
        </div>
        <div class="document-manager__file-attributes-wrp">
          <file-attributes-viewer
            :metadata="metadata"
            :download-link="downloadLink"
          />
        </div>
        <div class="document-manager__state-checker-wrp">
          <state-checker
            :download-link="downloadLink"
            :file-hash="metadata.fileHash"
            :file-mime-type="metadata.fileMimeType"
          />
        </div>
        <div class="document-manager__description-viewer-wrp">
          <description-viewer
            :metadata="metadata"
            :signer="signer"
            :document-account-id="attachedAccountId"
            @update="loadDocument"
          />
        </div>
        <div
          class="document-manager__add-comment-form-wrp"
          v-if="signer.isAllowedToUpdateMetadata"
        >
          <add-comment-form
            :document-account-id="attachedAccountId"
            :metadata="metadata"
            @comment-add="loadDocument"
          />
        </div>
        <div class="document-manager__comment-list-viewer-wrp">
          <comment-list-viewer :comments="comments" />
        </div>
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
import FilePreview from './components/file-preview'
import DocumentUploaderViewer from './components/document-uploader-viewer'
import CommentListViewer from './components/comment-list-viewer'
import AddCommentForm from './components/add-comment-form'

import SignersManagerModule from './modules/signers-manager'

import LoadSpinner from '@/vue/common/Loader'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { api } from '@/api'

import { Metadata } from './wrappers/metadata'
import { Signer } from './wrappers/signer'
import { ChangeRoleRequest } from './wrappers/change-role-request'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@/js/errors'

import { REQUEST_STATES } from '@/js/const/request-states.const'

export default {
  name: 'document-manager-module',
  components: {
    DescriptionViewer,
    FileAttributesViewer,
    StateChecker,
    FilePreview,
    DocumentUploaderViewer,
    CommentListViewer,
    AddCommentForm,

    SignersManagerModule,

    LoadSpinner,
  },
  props: {
    attachedAccountId: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    signer: null,
    metadata: null,
    downloadLink: null,
    comments: [],

    isLoading: false,
    isUnauthorized: false,
    isNotFound: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.wallet,
    ]),
  },
  async created () {
    await Promise.all([
      this.loadDocument(),
      this.loadSigner(),
    ])
  },
  methods: {
    async loadSigner () {
      const endpoint = `/v3/accounts/${this.attachedAccountId}/signers`
      const { data: signers } = await api().getWithSignature(endpoint, {
        page: {
          limit: 100,
        },
      })

      this.signer = signers
        .map(s => new Signer(s))
        .find(s => s.publicKey === this.wallet.accountId)
    },
    async getMetadataHistory () {
      const { data: changeRoleRequests } = await api().getWithSignature('/v3/change_role_requests', {
        include: ['request_details'],
        filter: {
          state: REQUEST_STATES.approved,
          requestor: this.attachedAccountId,
        },
        page: {
          order: 'desc',
          limit: 50,
        },
      })

      const comments = await Promise.all(
        changeRoleRequests
          .map(r => new ChangeRoleRequest(r))
          .map(request => {
            return {
              blobId: request.blobId,
              createdAt: request.createdAt,
            }
          })
          .map(async ({ createdAt, blobId }) => {
            const blob = await this.getBlob(blobId)
            return new Metadata(blob, createdAt)
          })
      )

      if (!comments[0]) {
        throw new errors.NotFoundError()
      }

      return comments
    },
    async loadDocument () {
      this.isLoading = true
      try {
        const metadataHistory = await this.getMetadataHistory()
        this.metadata = metadataHistory.pop()
        this.comments = metadataHistory

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
    async getBlob (blobId) {
      // TODO: legacy endpoint, new one currently has problems with sign check
      const endpoint = `/accounts/${this.attachedAccountId}/blobs/${blobId}`
      const { data } = await api().getWithSignature(endpoint)

      return JSON.parse(data.value)
    },
    async getDownloadLink (fileKey) {
      const { data: { url } } = await api().getWithSignature(`/documents/${fileKey}`)
      return url
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/mixins";

.document-manager {
  &__inner {
    display: flex;

    @include respond-to(xmedium) {
      flex-direction: column;
    }
  }

  &__document-info-wrp {
    width: 50%;
    max-width: 55rem;
    margin-left: 2.5rem;
    padding-left: 2.5rem;
    border-left: 1px solid #aaa;

    @include respond-to(xmedium) {
      flex-direction: column;
      margin-right: 0;
      margin-bottom: 5rem;
      max-width: 100%;
      width: 100%;
    }
  }

  &__header {
    margin-bottom: 3rem;
  }

  &__right-section-wrp {
    width: 50%;
    max-width: 40rem;

    @include respond-to(xmedium) {
      width: 100%;
    }
  }

  &__document-uploader-viewer-wrp {
    margin-bottom: 3rem;
  }

  &__file-preview-wrp {
    margin-bottom: 3rem;

    @include respond-to(xmedium) {
      display: none;
    }
  }

  &__file-attributes-wrp { margin-bottom: 1.5rem }
  &__state-checker-wrp { margin-bottom: 3rem }
  &__comment-list-viewer-wrp { margin-top: 3rem }
  &__add-comment-form-wrp { margin-top: 5rem }
}
</style>
