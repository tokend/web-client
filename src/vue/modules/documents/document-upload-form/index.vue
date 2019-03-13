<template>
  <div class="document-upload-form">
    <form
      class="app__form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <file-field
            :label="'document-upload-form.document-lbl' | globalize"
            :note="'document-upload-form.file-type-note' | globalize"
            accept="image/*, .pdf"
            :document-type="DOCUMENT_TYPES.healthcareDocument"
            v-model="form.document"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage('form.document')"
          />
        </div>
      </div>

      <div class="app__form-row document-upload-form__description">
        <div class="app__form-field">
          <p>{{ 'document-upload-form.description-lbl' | globalize }}</p>
          <markdown-field
            v-model="form.description"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage('form.description')"
          />
        </div>
      </div>

      <div class="app__form-actions document-upload-form__actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          @ok="submit"
          @cancel="hideConfirmation"
        />

        <template v-else>
          <button
            v-ripple
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'document-upload-form.upload-btn' | globalize }}
          </button>
          <p class="document-upload-form__upload-state-msg">
            <template v-if="uploadState.isCalculatingHash">
              <!--eslint-disable-next-line-->
              {{ 'document-upload-form.submit-steps.calculating-hash' | globalize }}
            </template>
            <template v-else-if="uploadState.isCreatingAccount">
              <!--eslint-disable-next-line-->
              {{ 'document-upload-form.submit-steps.creating-account' | globalize }}
            </template>
            <template v-else-if="uploadState.isUploadingFile">
              <!--eslint-disable-next-line-->
              {{ 'document-upload-form.submit-steps.uploading-file' | globalize }}
            </template>
            <template v-else-if="uploadState.isCreatingBlob">
              <!--eslint-disable-next-line-->
              {{ 'document-upload-form.submit-steps.creating-blob' | globalize }}
            </template>
            <template v-else-if="uploadState.isCreatingChangeRoleRequest">
              <!--eslint-disable-next-line-->
              {{ 'document-upload-form.submit-steps.creating-change-role-request' | globalize }}
            </template>
          </p>
        </template>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import DocumentUploaderMixin from './mixins/document-uploader.mixin'
import CreateAccountMixin from './mixins/create-account.mixin'

import { Wallet, base, errors } from '@tokend/js-sdk'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { documentContainer, required } from '@validators'

import { initApi } from './_api'
import { initConfig } from './_config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { FileUtil } from '@/js/utils/file.util'
import { CryptoUtil } from './utils/crypto.util'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'document-upload-form-module',
  mixins: [
    FormMixin,
    DocumentUploaderMixin,
    CreateAccountMixin,
  ],

  props: {
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     * @property config.storageURL - the url of file storage server
     */
    config: {
      type: Object,
      required: true,
    },
    wallet: {
      type: Wallet,
      required: true,
    },
  },

  data: _ => ({
    form: {
      document: null,
      description: '',
    },

    isPending: false,
    uploadState: {
      isCalculatingHash: false,
      isCreatingAccount: false,
      isUploadingFile: false,
      isCreatingBlob: false,
      isCreatingChangeRoleRequest: false,
    },
    DOCUMENT_TYPES,
  }),
  validations: {
    form: {
      document: { documentContainer },
      description: { required },
    },
  },

  created () {
    initApi(this.wallet, this.config)
    initConfig(this.config)
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return

      this.hideConfirmation()
      this.disableForm()

      try {
        await this.processDocumentUploading()
        Bus.success('document-upload-form.uploaded-msg')
        this.$emit(EVENTS.submit)
      } catch (e) {
        if (e instanceof errors.BadRequestError) {
          ErrorHandler.process(e, 'document-upload-form.document-exists-error')
        } else {
          ErrorHandler.process(e)
        }
      }

      this.enableForm()
      this.resetUploadState()
    },

    async processDocumentUploading () {
      this.uploadState.isCalculatingHash = true
      const docHashBuffer = await this.getDocHashBuffer(this.form.document)
      this.uploadState.isCalculatingHash = false

      const accountId = await this.getAccountIdFromDocHash(docHashBuffer)

      this.uploadState.isCreatingAccount = true
      await this.createAccount(accountId)
      this.uploadState.isCreatingAccount = false

      this.uploadState.isUploadingFile = true
      const fileKey = await this.uploadDocument(
        this.form.document,
        accountId
      )
      this.uploadState.isUploadingFile = false

      this.uploadState.isCreatingBlob = true
      const blobId = await this.createBlob({
        file: {
          key: fileKey,
          hash: CryptoUtil.convertHashBufferToHex(docHashBuffer),
          name: this.form.document.name,
          mime_type: this.form.document.mimeType,
        },
        description: this.form.description,
      })
      this.uploadState.isCreatingBlob = false

      this.uploadState.isCreatingChangeRoleRequest = true
      await this.createChangeRoleRequest(blobId)
      this.uploadState.isCreatingChangeRoleRequest = false
    },

    async getDocHashBuffer (document) {
      const docText = await FileUtil.getText(this.form.document.file)
      const docHashBuffer = await CryptoUtil.sha256(docText)

      return docHashBuffer
    },

    async getAccountIdFromDocHash (docHashBuffer) {
      const keypair = base.Keypair.fromRawSeed(docHashBuffer)
      return keypair.accountId()
    },

    resetUploadState () {
      this.uploadState = {
        isCalculatingHash: false,
        isCreatingAccount: false,
        isUploadingFile: false,
        isCreatingBlob: false,
        isCreatingChangeRoleRequest: false,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.document-upload-form__description {
  margin-top: 4rem;
}

.document-upload-form__actions {
  display: flex;
  align-items: center;
  margin-top: 4.9rem;

  button {
    max-width: 18rem;
    width: 100%;
  }
}

.document-upload-form__upload-state-msg {
  margin-left: 2rem;
}
</style>
