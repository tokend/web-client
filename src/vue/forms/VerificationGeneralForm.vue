<template>
  <div class="verification-general-form">
    <template v-if="isLoaded">
      <p class="verification-general-form__account-info-title">
        {{ 'verification-form.account-information-lbl' | globalize }}
      </p>

      <form
        novalidate
        class="app-form"
        @submit.prevent="isFormValid() && showConfirmation()"
      >
        <div class="verification-general-form__block">
          <p class="verification-general-form__block-label">
            {{ 'verification-form.personal-details-lbl' | globalize }}
          </p>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                white-autofill
                v-model="form.personal.firstName"
                @blur="touchField('form.personal.firstName')"
                id="verification-general-first-name"
                :label="'verification-form.first-name-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.personal.firstName')"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                white-autofill
                v-model="form.personal.lastName"
                @blur="touchField('form.personal.lastName')"
                id="verification-general-last-name"
                :label="'verification-form.last-name-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.personal.lastName')"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <date-field
                v-model="form.personal.birthDate"
                :enable-time="false"
                :disable-after="new Date().toString()"
                @blur="touchField('form.personal.birthDate')"
                id="verification-general-birth-date"
                :label="'verification-form.birth-date-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.personal.birthDate')"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <date-field
                v-model="form.personal.documentExpirationDate"
                :enable-time="false"
                :disable-before="new Date().toString()"
                @blur="touchField('form.personal.documentExpirationDate')"
                id="verification-general-document-expiration-date"
                :label="'verification-form.document-expiration-date-lbl'
                  | globalize"
                :error-message="getFieldErrorMessage(
                  'form.personal.documentExpirationDate'
                )"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <!-- eslint-disable max-len -->
              <file-field
                v-model="form.documents.idDocument"
                :note="'verification-form.file-type-note' | globalize"
                accept="image/*, .pdf"
                :document-type="DOCUMENT_TYPES.kycIdDocument"
                :label="'verification-form.id-document-lbl' | globalize"
                :disabled="formMixin.isDisabled"
                :error-message="getFieldErrorMessage('form.documents.idDocument')"
              />
              <!-- eslint-enable max-len -->
            </div>
          </div>
        </div>

        <div class="verification-general-form__block">
          <p class="verification-general-form__block-label">
            {{ 'verification-form.address-details-lbl' | globalize }}
          </p>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                white-autofill
                v-model="form.address.firstLine"
                @blur="touchField('form.address.firstLine')"
                id="verification-general-address-first-line"
                :label="'verification-form.address-first-line-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.address.firstLine')"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                white-autofill
                v-model="form.address.secondLine"
                @blur="touchField('form.address.secondLine')"
                id="verification-general-address-second-line"
                :label="'verification-form.address-second-line-lbl' | globalize"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                white-autofill
                v-model="form.address.city"
                @blur="touchField('form.address.city')"
                id="verification-general-city"
                :label="'verification-form.city-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.address.city')"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                white-autofill
                v-model="form.address.state"
                @blur="touchField('form.address.state')"
                id="verification-general-state"
                :label="'verification-form.state-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.address.state')"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                white-autofill
                v-model="form.address.postalCode"
                @blur="touchField('form.address.postalCode')"
                id="verification-general-postal-code"
                :label="'verification-form.postal-code-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.address.postalCode')"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <file-field
                v-model="form.documents.proofDocument"
                :note="'verification-form.file-type-note' | globalize"
                accept="image/*, .pdf"
                :document-type="DOCUMENT_TYPES.kycProofOfAddress"
                :label="'verification-form.proof-document-lbl' | globalize"
                :disabled="formMixin.isDisabled"
                :error-message="getFieldErrorMessage(
                  'form.documents.proofDocument'
                )"
              />
            </div>
          </div>
        </div>

        <div class="verification-general-form__block">
          <p class="verification-general-form__block-label">
            {{ 'verification-form.photo-verification-lbl' | globalize }}
          </p>

          <div class="app__form-row">
            <div class="app__form-field">
              <p class="verification-general-form__photo-explanation">
                {{ 'verification-form.photo-explanation-msg' | globalize }}
              </p>
              <button
                v-ripple
                class="verification-general-form__verification-code-btn"
                :disabled="formMixin.isDisabled"
                @click.prevent="isCodeShown = true"
              >
                {{
                  isCodeShown
                    ? verificationCode
                    : 'verification-form.verification-code-btn' | globalize
                }}
              </button>
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <file-field
                v-model="form.documents.verificationPhoto"
                :note="'verification-form.file-type-note' | globalize"
                accept="image/*, .pdf"
                :document-type="DOCUMENT_TYPES.kycSelfie"
                :label="'verification-form.photo-lbl' | globalize"
                :disabled="formMixin.isDisabled"
                :error-message="getFieldErrorMessage(
                  'form.documents.verificationPhoto'
                )"
              />
            </div>
          </div>
        </div>

        <div class="app__form-actions">
          <form-confirmation
            v-if="formMixin.isConfirmationShown"
            @ok="hideConfirmation() || submit()"
            @cancel="hideConfirmation"
          />
          <button
            v-ripple
            v-else
            type="submit"
            class="verification-general-form__submit-btn"
            :disabled="formMixin.isDisabled"
          >
            {{ 'verification-form.submit-btn' | globalize }}
          </button>
        </div>
      </form>
    </template>

    <template v-else-if="isLoadingFailed">
      <p>
        {{ 'verification-form.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <loader :message-id="'verification-form.loading-msg'" />
    </template>
  </div>
</template>

<script>
import VerificationFormMixin from '@/vue/mixins/verification-form.mixin'
import Loader from '@/vue/common/Loader'

import { Sdk } from '@/sdk'

import { DocumentUploader } from '@/js/helpers/document-uploader'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { BLOB_TYPES } from '@/js/const/blob-types.const'

import { required, documentContainer } from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'verification-general-form',
  components: {
    Loader,
  },
  mixins: [VerificationFormMixin],

  data: _ => ({
    form: {
      personal: {
        firstName: '',
        lastName: '',
        birthDate: '',
        documentExpirationDate: '',
      },
      address: {
        firstLine: '',
        secondLine: '',
        city: '',
        state: '',
        postalCode: '',
      },
      documents: {
        idDocument: null,
        proofDocument: null,
        verificationPhoto: null,
      },
    },
    isLoaded: false,
    isLoadingFailed: false,
    isCodeShown: false,
    DOCUMENT_TYPES,
  }),

  validations: {
    form: {
      personal: {
        firstName: { required },
        lastName: { required },
        birthDate: { required },
        documentExpirationDate: { required },
      },
      address: {
        firstLine: { required },
        city: { required },
        state: { required },
        postalCode: { required },
      },
      documents: {
        idDocument: { documentContainer },
        proofDocument: { documentContainer },
        verificationPhoto: { documentContainer },
      },
    },
  },

  computed: {
    ...mapGetters({
      kvEntryGeneralRoleId: vuexTypes.kvEntryGeneralRoleId,
    }),
    verificationCode () {
      return this.account.accountId.slice(1, 6)
    },
  },

  async created () {
    try {
      await this.loadAccount(this.accountId)
      await this.loadKyc()
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }

    if (this.kycState) {
      this.form = this.parseKycData(this.kycLatestData)
      if (this.kycState !== REQUEST_STATES_STR.rejected) {
        this.disableForm()
      }
    }
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        await this.uploadDocuments()
        const kycBlobId = await this.createKycBlob(BLOB_TYPES.kycGeneral)
        const operation = this.createKycOperation(kycBlobId)
        await Sdk.horizon.transactions.submitOperations(operation)
        await this.loadKyc()
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },

    async uploadDocuments () {
      for (let document of Object.values(this.form.documents)) {
        if (!document.key) {
          document = await DocumentUploader.uploadSingleDocument(document)
        }
      }
    },

    createKycData () {
      return {
        first_name: this.form.personal.firstName,
        last_name: this.form.personal.lastName,
        date_of_birth: this.form.personal.birthDate,
        id_expiration_date: this.form.personal.documentExpirationDate,
        address: {
          line_1: this.form.address.firstLine,
          line_2: this.form.address.secondLine,
          city: this.form.address.city,
          state: this.form.address.state,
          postal_code: this.form.address.postalCode,
        },
        documents: {
          [DOCUMENT_TYPES.kycIdDocument]:
            this.form.documents.idDocument.getDetailsForSave(),
          [DOCUMENT_TYPES.kycProofOfAddress]:
            this.form.documents.proofDocument.getDetailsForSave(),
          [DOCUMENT_TYPES.kycSelfie]:
            this.form.documents.verificationPhoto.getDetailsForSave(),
        },
      }
    },

    parseKycData (kycData) {
      return {
        personal: {
          firstName: kycData.first_name,
          lastName: kycData.last_name,
          birthDate: kycData.date_of_birth,
          documentExpirationDate: kycData.id_expiration_date,
        },
        address: {
          firstLine: kycData.address.line_1,
          secondLine: kycData.address.line_2,
          city: kycData.address.city,
          state: kycData.address.state,
          postalCode: kycData.address.postal_code,
        },
        documents: {
          idDocument: kycData.documents[DOCUMENT_TYPES.kycIdDocument]
            ? this.wrapDocument(kycData.documents[DOCUMENT_TYPES.kycIdDocument])
            : {},
          proofDocument: kycData.documents[DOCUMENT_TYPES.kycProofOfAddress]
            ? this.wrapDocument(kycData
              .documents[DOCUMENT_TYPES.kycProofOfAddress])
            : {},
          verificationPhoto: kycData.documents[DOCUMENT_TYPES.kycSelfie]
            ? this.wrapDocument(kycData.documents[DOCUMENT_TYPES.kycSelfie])
            : {},
        },
      }
    },

    wrapDocument (document) {
      return new DocumentContainer({
        mimeType: document.mime_type,
        name: document.name,
        key: document.key,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.verification-general-form {
  margin-top: 4rem;
}

.verification-general-form__submit-btn {
  @include button-raised();

  margin-right: auto;
  width: 100%;
  max-width: 20rem;
}

.verification-general-form__verification-code-btn {
  @include button-raised();
  margin-top: 1.5rem;
}

.verification-general-form__account-info-title {
  color: $col-primary;
  font-size: 1.3rem;
}

.verification-general-form {
  form {
    margin-top: 1rem;
    background-color: $col-block-bg;
    padding: 2.4rem;

    @include box-shadow();

    & > .verification-general-form__block:not(:first-child) {
      margin-top: 6rem;
    }
  }
}

.verification-general-form__block-label {
  font-size: 1.5rem;
  font-weight: bold;
}

.verification-general-form__photo-explanation {
  font-size: 1.5rem;
}
</style>
