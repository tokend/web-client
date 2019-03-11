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
            :document-type="DOCUMENT_TYPES.identity_card"
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
          :is-pending="isDocumentUploading"
          @ok="submit"
          @cancel="hideConfirmation"
        />

        <button
          v-else
          v-ripple
          type="submit"
          class="app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ 'document-upload-form.upload-btn' | globalize }}
        </button>
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
    isDocumentUploading: false,
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

      this.isDocumentUploading = true
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

      this.hideConfirmation()
      this.isDocumentUploading = false
      this.enableForm()
    },

    async processDocumentUploading () {
      const docHashBuffer = await this.getDocHashBuffer(this.form.document)
      const accountId = await this.getAccountIdFromDocHash(docHashBuffer)
      await this.createAccount(accountId)

      const documentId = await this.uploadDocument(
        this.form.document,
        accountId
      )

      const blobId = await this.createBlob({
        documentId,
        documentHash: CryptoUtil.convertHashBufferToHex(docHashBuffer),
        description: this.form.description,
      })

      await this.createChangeRoleRequest(blobId)
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
  },
}
</script>

<style lang="scss" scoped>
.document-upload-form__description {
  margin-top: 4rem;
}

.document-upload-form__actions {
  margin-top: 4.9rem;

  button {
    max-width: 18rem;
    width: 100%;
  }
}
</style>
