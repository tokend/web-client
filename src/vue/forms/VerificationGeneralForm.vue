<template>
  <div class="verification-general-form">
    <p class="verification-general-form__account-info-title">
      {{ 'verification-form.account-information-lbl' | globalize }}
    </p>
    <form
      novalidate
      class="app-form"
      @submit.prevent="submit"
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
            <file-field
              v-model="form.documents.idDocument"
              :note="'verification-form.file-type-note' | globalize"
              accept="image/*, .pdf"
              :document-type="DOCUMENT_TYPES.kycIdDocument"
              :label="'verification-form.id-document-lbl' | globalize"
              :disabled="formMixin.isDisabled"
              :error-message="getFieldErrorMessage('form.documents.idDocument')"
            />
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
            <!--
              :key is a hack to ensure that the component will be updated
              after property change
            -->
            <select-field
              :key="form.address.country"
              v-model="form.address.country"
              :values="countries"
              @blur="touchField('form.address.country')"
              id="verification-general-country"
              :label="'verification-form.country-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.address.country')"
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
          v-if="isConfirming"
          @ok="submit"
          @cancel="isConfirming = false"
        />
        <button
          v-ripple
          v-else
          type="submit"
          class="verification-general-form__submit-btn"
          :disabled="formMixin.isDisabled"
          @click.prevent="isConfirming = true"
        >
          {{ 'verification-form.submit-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormConfirmation from '@/vue/common/FormConfirmation'

import VerificationFormMixin from '@/vue/mixins/verification-form.mixin'

import { Sdk } from '@/sdk'
import { ACCOUNT_TYPES } from '@tokend/js-sdk'

import { DocumentUploader } from '@/js/helpers/document-uploader'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { BLOB_TYPES } from '@/js/const/blob-types.const'

import { required, documentContainer } from '@validators'

export default {
  name: 'verification-general-form',
  components: {
    FormConfirmation,
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
        country: '',
        state: '',
        postalCode: '',
      },
      documents: {
        idDocument: null,
        proofDocument: null,
        verificationPhoto: null,
      },
    },
    isCodeShown: false,
    accountType: ACCOUNT_TYPES.general,
    DOCUMENT_TYPES,
    countries: [],
    isConfirming: false,
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
        country: { required },
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
    verificationCode () {
      return this.account.accountId.slice(1, 6)
    },
  },
  async created () {
    try {
      await this.loadKyc()
      const { data } = await Sdk.horizon.public.getEnums()
      this.countries = data.countries
    } catch (e) {
      console.error(e)
      ErrorHandler.process(e)
    }
    if (this.kycState) {
      this.form = this.convertTemplateToForm(this.kycLatestData)
      if (this.kycState !== REQUEST_STATES_STR.rejected) {
        this.disableForm()
      }
    }
  },
  methods: {
    async submit () {
      this.isConfirming = false
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        await this.uploadDocuments()
        const kycBlob = await this.createKycBlob(BLOB_TYPES.kycGeneral)
        const operation = this.createKycOperation(kycBlob)
        await Sdk.horizon.transactions.submitOperations(operation)
        await this.loadKyc()
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
        this.enableForm()
      }
    },
    async uploadDocuments () {
      for (let document of Object.values(this.form.documents)) {
        if (!document.key) {
          const documentKey = await DocumentUploader.uploadDocument(
            document.getDetailsForUpload()
          )
          document.setKey(documentKey)
        }
      }
    },
    convertFormToTemplate () {
      return {
        first_name: this.form.personal.firstName,
        last_name: this.form.personal.lastName,
        date_of_birth: this.form.personal.birthDate,
        id_expiration_date: this.form.personal.documentExpirationDate,
        address: {
          line_1: this.form.address.firstLine,
          line_2: this.form.address.secondLine,
          city: this.form.address.city,
          country: this.form.address.country,
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
    convertTemplateToForm (template) {
      return {
        personal: {
          firstName: template.first_name,
          lastName: template.last_name,
          birthDate: template.date_of_birth,
          documentExpirationDate: template.id_expiration_date,
        },
        address: {
          firstLine: template.address.line_1,
          secondLine: template.address.line_2,
          city: template.address.city,
          country: template.address.country,
          state: template.address.state,
          postalCode: template.address.postal_code,
        },
        documents: {
          idDocument: this.wrapDocument(
            template.documents[DOCUMENT_TYPES.kycIdDocument]
          ),
          proofDocument: this.wrapDocument(
            template.documents[DOCUMENT_TYPES.kycProofOfAddress]
          ),
          verificationPhoto: this.wrapDocument(
            template.documents[DOCUMENT_TYPES.kycSelfie]
          ),
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

.verification-general-form__submit-btn {
  @include button-raised();

  margin-right: auto;
  margin-bottom: 2rem;
  width: 20rem;
}

.verification-general-form__verification-code-btn {
  @include button-raised();
  margin-top: 1.5rem;
}

.verification-general-form__account-info-title {
  color: $col-primary;
  font-size: 1.3rem;
  margin-top: 4rem;
}

.verification-general-form {
  form {
    margin-top: 1rem;
    background-color: $col-block-bg;
    box-shadow: 0 .6rem 1rem 0 $col-block-shadow;
    padding: 2.4rem;

    & > .verification-general-form__block:not(:first-child) {
      margin-top: 6rem;
    }
  }
}

.verification-general-form__block-label {
  margin-bottom: -2.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.verification-general-form__photo-explanation {
  font-size: 1.5rem;
}
</style>
