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
          <p>{{ 'document-upload-form.description' | globalize }}</p>
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

import { Wallet, base } from '@tokend/js-sdk'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { documentContainer, required } from '@validators'

import { initApi, api } from './_api'
import { initConfig } from './_config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { FileUtil } from '@/js/utils/file.util'
import { CryptoUtil } from './utils/crypto.util'

import { DocumentUploader } from './helpers/document-uploader'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'document-upload-form-module',
  mixins: [FormMixin],
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
        const documentHash = await this.getDocumentHash(this.form.document)
        const accountId = this.getAccountIdFromHash(documentHash)

        await this.createAccount(accountId)
        const documentId = await this.uploadDocument(this.form.document)
        const blobId = await this.createDetailsBlob(accountId, {
          id: documentId,
          hash: documentHash,
          description: this.form.description,
        })

        await this.createChangeRoleRequest(accountId, blobId)

        Bus.success('document-upload-form.uploaded-msg')
        this.$emit(EVENTS.submit)
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.hideConfirmation()
      this.isDocumentUploading = false
      this.enableForm()
    },

    async getDocumentHash (document) {
      const fileText = await FileUtil.getText(document.file)
      const fileHash = await CryptoUtil.getAccountHash(fileText)
      return fileHash
    },

    getAccountIdFromHash (hash) {
      const keypair = base.Keypair.fromRawSeed(hash)
      return keypair.accountId()
    },

    async createAccount (accountId) {
      const operation = base.CreateAccountBuilder.createAccount({
        destination: accountId,
        roleID: '1',
        signersData: [{
          roleID: '1',
          publicKey: this.wallet.accountId,
          weight: '1000',
          identity: '1',
          details: {},
        }],
      })

      await api().postOperations(operation)
    },

    async createChangeRoleRequest (accountId, blobId) {
      const operation = base.CreateChangeRoleRequestBuilder
        .createChangeRoleRequest({
          requestID: '0',
          destinationAccount: accountId,
          accountRoleToSet: '2',
          creatorDetails: {
            blob_id: blobId,
          },
          allTasks: 3,
        })

      await api().postOperations(operation)
    },

    async createDetailsBlob (accountId, details) {
      const { data } = await api().postWithSignature(
        `/accounts/${this.wallet.accountId}/blobs`,
        {
          data: {
            type: 'kyc_form',
            attributes: {
              value: JSON.stringify(details),
            },
          },
        }
      )

      return data.id
    },

    async uploadDocument (document) {
      document = await DocumentUploader
        .uploadSingleDocument(document, this.wallet.accountId)
      return document.key
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
}
</style>
