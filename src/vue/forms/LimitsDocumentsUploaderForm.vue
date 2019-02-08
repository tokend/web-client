<template>
  <form class="app-form">
    <h3 class="app__form-subheading limits-documents-uploader-form__subheading">
      {{ 'limits-documents-uploader-form.form-subheading' | globalize }}
    </h3>
    <template v-for="(doc, d) in request.requestedDocs">
      <div
        class="app__form-row limits-documents-uploader-form__document"
        :key="`limits-documents-uploader-document-${d}`"
      >
        <div class="limits-documents-uploader-form__document-descr">
          <span>
            <!-- eslint-disable-next-line -->
            {{ 'limits-documents-uploader-form.document-type-lbl' | globalize }}:
          </span>
          <span>
            {{ DOCUMENT_TYPES_TRANSLATIONS_ID[doc.label] | globalize }}
          </span>
        </div>
        <div
          class="limits-documents-uploader-form__document-descr"
          v-if="doc.description"
        >
          <span>
            {{ 'limits-documents-uploader-form.note-lbl' | globalize }}:
          </span>
          <span> {{ doc.description }} </span>
        </div>
        <div class="app__form-field">
          <file-field
            v-model="form.documents[doc.label]"
            :note="'limits-documents-uploader-form.file-type-note' | globalize"
            accept="image/*, .pdf"
            :error-message="getFieldErrorMessage(
              `form.documents.${doc.label}`
            )"
            :document-type="doc.label"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
    </template>

    <div class="app__form-actions">
      <button
        v-if="!formMixin.isFormConfirmationShown"
        v-ripple
        type="button"
        class="app__button-raised"
        :disabled="formMixin.isDisabled"
        @click="tryToSubmit"
      >
        {{ 'limits-documents-uploader-form.upload-docs-btn' | globalize }}
      </button>

      <form-confirmation
        v-if="formMixin.isFormConfirmationShown"
        :is-pending="formMixin.isDisabled"
        @cancel="hideFormConfirmation"
        @ok="submit"
      />
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { DOCUMENT_TYPES_TRANSLATIONS_ID } from '@/js/const/document-types.const'
import { DocumentUploader } from '@/js/helpers/document-uploader'
import { required, documentContainer } from '@validators'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { base, errors } from '@tokend/js-sdk'
import { Sdk } from '@/sdk'
import { LIMITS_REQUEST_TYPE } from '@/js/const/limits.const'
import { OPERATION_ERROR_CODES } from '@/js/const/operation-error-codes.const'

const EVENTS = {
  requestUploaded: 'request-uploaded',
}

export default {
  name: 'limits-documents-uploader-form',
  components: {
  },
  mixins: [FormMixin],
  props: {
    request: { type: Object, required: true, default: () => ({}) },
  },
  data: () => ({
    DOCUMENT_TYPES_TRANSLATIONS_ID,
    form: {
      documents: {},
    },
  }),
  validations () {
    const documents = {}

    for (const doc of this.request.requestedDocs) {
      documents[doc.label] = {
        documentContainer,
        required,
      }
    }

    return {
      form: { documents },
    }
  },
  methods: {
    tryToSubmit () {
      if (!this.isFormValid()) return
      this.showFormConfirmation()
    },
    async submit () {
      this.disableForm()
      try {
        await this.uploadDocuments()
        await this.uploadLimitsUpdateRequest()
        Bus.success('limits-documents-uploader-form.documents-upload-success')
        this.$emit(EVENTS.requestUploaded)
      } catch (error) {
        if (
          error instanceof errors.TransactionError &&
          // eslint-disable-next-line
          error.includesOpCode(OPERATION_ERROR_CODES.opManageLimitsRequestReferenceDuplication)
        ) {
          Bus.error('limits-documents-uploader-form.error-duplicate-request')
        } else {
          ErrorHandler.process(error)
        }
      }
      this.enableForm()
      this.hideFormConfirmation()
    },
    async uploadLimitsUpdateRequest () {
      // eslint-disable-next-line
      const operation = base.CreateManageLimitsRequestBuilder.createManageLimitsRequest({
        requestID: this.request.id,
        details: {
          operationType: this.request.operationType,
          statsOpType: this.request.operationTypeI,
          asset: this.request.asset,
          limits: this.request.limits,
          requestType: LIMITS_REQUEST_TYPE.docsUploading,
          note: this.request.note,
          documents: this.prepareDocumentsToUpload(),
        },
      })
      await Sdk.horizon.transactions.submitOperations(operation)
    },
    async uploadDocuments () {
      for (const document of Object.values(this.form.documents)) {
        if (!document.key) {
          const documentKey = await DocumentUploader.uploadDocument(
            document.getDetailsForUpload()
          )
          document.setKey(documentKey)
        }
      }
    },
    prepareDocumentsToUpload () {
      const documents = {}
      this.request.requestedDocs.forEach(item => {
        const doc = this.form.documents[item.label]

        documents[item.label] = {
          description: item.description,
          file: doc,
        }
      })
      return documents
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.limits-documents-uploader-form__subheading {
  margin-bottom: 3.2rem;
}

.limits-documents-uploader-form__document {
  flex-direction: column;
}

.limits-documents-uploader-form__document-descr {
  font-size: 1.6rem;
}
</style>
