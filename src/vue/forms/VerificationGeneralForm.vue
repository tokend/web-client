<template>
  <form class="app-form verification-form" @submit.prevent="submit">
    <div class="verification-form__block">
      <p class="verification-form__block-label">
        {{ 'verification-page.personal-details-lbl' | globalize }}
      </p>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.personal.firstName"
            @blur="touchField('form.personal.firstName')"
            id="verification-general-first-name"
            :label="'verification-page.first-name-lbl' | globalize"
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
            :label="'verification-page.last-name-lbl' | globalize"
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
            @blur="touchField('form.personal.birthDate')"
            id="verification-general-birth-date"
            :label="'verification-page.birth-date-lbl' | globalize"
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
            @blur="touchField('form.personal.documentExpirationDate')"
            id="verification-general-document-expiration-date"
            :label="'verification-page.document-expiration-date-lbl'
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
            :note="'verification-page.file-type-note' | globalize"
            accept="image/*, .pdf"
            :document-type="DOCUMENT_TYPES.kycIdDocument"
            :label="'verification-page.id-document-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage('form.documents.idDocument')"
          />
        </div>
      </div>
    </div>

    <div class="verification-form__block">
      <p class="verification-form__block-label">
        {{ 'verification-page.address-details-lbl' | globalize }}
      </p>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.address.firstLine"
            @blur="touchField('form.address.firstLine')"
            id="verification-general-address-first-line"
            :label="'verification-page.address-first-line-lbl' | globalize"
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
            :label="'verification-page.address-second-line-lbl' | globalize"
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
            :label="'verification-page.city-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.address.city')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.address.country"
            @blur="touchField('form.address.country')"
            id="verification-general-country"
            :label="'verification-page.country-lbl' | globalize"
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
            :label="'verification-page.state-lbl' | globalize"
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
            :label="'verification-page.postal-code-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.address.postalCode')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <file-field
            v-model="form.documents.proofDocument"
            :note="'verification-page.file-type-note' | globalize"
            accept="image/*, .pdf"
            :document-type="DOCUMENT_TYPES.kycProofOfAddress"
            :label="'verification-page.proof-document-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage(
              'form.documents.proofDocument'
            )"
          />
        </div>
      </div>
    </div>

    <div class="verification-form__block">
      <p class="verification-form__block-label">
        {{ 'verification-page.photo-verification-lbl' | globalize }}
      </p>
      <div class="app__form-row">
        <div class="app__form-field">
          <p class="verification-form__photo-explanation">
            {{ 'verification-page.photo-explanation-lbl' | globalize }}
          </p>
          <button
            v-ripple
            class="verification-form__verification-code-btn"
            :disabled="formMixin.isDisabled"
            @click.prevent="isCodeShown = true"
          >
            {{
              isCodeShown
                ? verificationCode
                : 'verification-page.verification-code-btn' | globalize
            }}
          </button>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <file-field
            v-model="form.documents.verificationPhoto"
            :note="'verification-page.file-type-note' | globalize"
            accept="image/*, .pdf"
            :document-type="DOCUMENT_TYPES.kycSelfie"
            :label="'verification-page.photo-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage(
              'form.documents.verificationPhoto'
            )"
          />
        </div>
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="verification-form__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'verification-page.submit-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

import { Sdk } from '@/sdk'
import { ACCOUNT_TYPES, base } from '@tokend/js-sdk'

import { KycTemplateParser } from '@/js/helpers/kyc-template-parser'
import { DocumentUploader } from '@/js/helpers/document-uploader'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { BLOB_TYPES } from '@/js/const/blob-types.const'

import { required } from '@validators'

const KYC_LEVEL_TO_SET = 0

export default {
  name: 'verification-general-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      personal: {
        firstName: '',
        lastName: '',
        birthDate: '',
        documentExpirationDate: ''
      },
      address: {
        firstLine: '',
        secondLine: '',
        city: '',
        country: '',
        state: '',
        postalCode: '0'
      },
      documents: {
        idDocument: null,
        proofDocument: null,
        verificationPhoto: null
      }
    },
    isCodeShown: false,
    DOCUMENT_TYPES
  }),
  validations: {
    form: {
      personal: {
        firstName: { required },
        lastName: { required },
        birthDate: { required },
        documentExpirationDate: { required }
      },
      address: {
        firstLine: { required },
        city: { required },
        country: { required },
        state: { required },
        postalCode: { required }
      },
      documents: {
        idDocument: { required },
        proofDocument: { required },
        verificationPhoto: { required }
      }
    }
  },
  computed: {
    ...mapGetters({
      kycLatestData: vuexTypes.kycLatestData,
      kycState: vuexTypes.kycState,
      kycRequestId: vuexTypes.kycRequestId,
      account: vuexTypes.account
    }),
    verificationCode () {
      return this.account.accountId.slice(1, 6)
    }
  },
  async created () {
    try {
      await this.loadKyc()
    } catch (error) {
      console.error(error)
    }

    if (this.kycLatestData.first_name) {
      const kycData = KycTemplateParser.toTemplate(
        this.kycLatestData,
        ACCOUNT_TYPES.general
      )
      this.form = Object.assign(this.form, kycData)

      if (this.kycState !== REQUEST_STATES_STR.rejected) {
        this.disableForm()
      }
    }
  },
  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC
    }),
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()

      await this.uploadDocuments()

      const { data } = await Sdk.api.blobs.create(
        BLOB_TYPES.kycGeneral,
        JSON.stringify(KycTemplateParser.fromTemplate(
          this.form,
          ACCOUNT_TYPES.general
        )),
        this.account.accountId
      )
      const kycData = {
        blob_id: data.id
      }

      const operation =
        base.CreateUpdateKYCRequestBuilder.createUpdateKYCRequest({
          requestID: this.kycState === REQUEST_STATES_STR.rejected
            ? this.kycRequestId
            : '0',
          accountToUpdateKYC: this.account.accountId,
          accountTypeToSet: ACCOUNT_TYPES.general,
          kycLevelToSet: KYC_LEVEL_TO_SET,
          kycData: kycData
        })
      await Sdk.horizon.transactions.submitOperations(operation)
      await this.loadKyc()
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import './app-form';

.verification-form__submit-btn {
  @include button-raised();

  margin-right: auto;
  margin-bottom: 2rem;
  width: 20rem;
}

.verification-form__verification-code-btn {
  @include button-raised();
  margin-top: 1.5rem;
}

.verification-form {
  background-color: $col-block-bg;
  // FIXME
  box-shadow: 0 .6rem 1rem 0 rgba(0, 0, 0, 0.1);
  padding: 2.4rem;

  & > .verification-form__block:not(:first-child) {
    margin-top: 6rem;
  }
}

.verification-form__block-label {
  margin-bottom: -2.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.verification-form__photo-explanation {
  font-size: 1.5rem;
}
</style>
