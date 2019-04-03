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
                name="verification-general-first-name"
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
                name="verification-general-last-name"
                :label="'verification-form.last-name-lbl' | globalize"
                :error-message="getFieldErrorMessage('form.personal.lastName')"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <!-- eslint-disable max-len -->
              <file-field
                v-model="form.documents.idDocument"
                name="verification-general-id-document"
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

          <div class="app__form-row">
            <div class="app__form-field">
              <file-field
                v-model="form.documents.avatar"
                name="verification-general-avatar"
                :note="'verification-form.image-type-note' | globalize"
                accept="image/*"
                :document-type="DOCUMENT_TYPES.kycAvatar"
                :label="'verification-form.avatar-lbl' | globalize"
                :disabled="formMixin.isDisabled"
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
                name="verification-general-verification-photo"
                :note="'verification-form.image-type-note' | globalize"
                accept="image/*"
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
import _get from 'lodash/get'

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

const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

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
      documents: {
        avatar: null,
        idDocument: null,
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
      },
      documents: {
        idDocument: { documentContainer },
        verificationPhoto: { documentContainer },
      },
    },
  },

  computed: {
    ...mapGetters({
      kvEntryGeneralRoleId: vuexTypes.kvEntryGeneralRoleId,
      isAccountRoleReseted: vuexTypes.isAccountRoleReseted,
      previousAccountRole: vuexTypes.kycPreviousAccountRole,
    }),
    verificationCode () {
      return this.accountId.slice(1, 6)
    },
    isFormEditable () {
      return this.isAccountRoleReseted ||
        this.kycState === REQUEST_STATES_STR.rejected
    },
    isFormPopulatable () {
      return this.isAccountRoleReseted
        ? this.previousAccountRole === this.kvEntryGeneralRoleId
        : !!this.kycState
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

    if (this.isFormPopulatable) {
      this.form = this.parseKycData(this.kycLatestData)

      if (!this.isFormEditable) {
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
        const operation = this.createKycOperation(
          kycBlobId,
          this.kvEntryGeneralRoleId
        )
        await Sdk.horizon.transactions.submitOperations(operation)
        do {
          await this.loadKyc()
        } while (this.kycState !== REQUEST_STATES_STR.pending)
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },

    async uploadDocuments () {
      for (let document of Object.values(this.form.documents)) {
        if (document && !document.key) {
          document = await DocumentUploader.uploadSingleDocument(document)
        }
      }
    },

    createKycData () {
      return {
        first_name: this.form.personal.firstName,
        last_name: this.form.personal.lastName,
        documents: {
          // avatar is not required, it may not exist in old kyc data
          [DOCUMENT_TYPES.kycAvatar]: this.form.documents.avatar
            ? this.form.documents.avatar.getDetailsForSave()
            : EMPTY_DOCUMENT,
          [DOCUMENT_TYPES.kycIdDocument]:
            this.form.documents.idDocument.getDetailsForSave(),
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
        },
        documents: {
          avatar: this.wrapDocument(kycData, DOCUMENT_TYPES.kycAvatar),
          idDocument: this.wrapDocument(kycData, DOCUMENT_TYPES.kycIdDocument),
          verificationPhoto: this.wrapDocument(
            kycData,
            DOCUMENT_TYPES.kycSelfie
          ),
        },
      }
    },

    wrapDocument (kycData, documentType) {
      if (_get(kycData, `documents.${documentType}.key`)) {
        return new DocumentContainer(kycData.documents[documentType])
      } else {
        return null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

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
