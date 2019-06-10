<template>
  <div class="verification-general-form">
    <p class="verification-general-form__account-info-title">
      {{ 'verification-form.account-information-lbl' | globalize }}
    </p>

    <form
      novalidate
      class="app-form verification-general-form__tag"
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
              :file-extensions="['jpg', 'png', 'pdf']"
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
              :file-extensions="['jpg', 'png']"
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
              class="verification-general-form__verification-code-btn
                     app__button-raised"
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
              :file-extensions="['jpg', 'png']"
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
          class="verification-general-form__submit-btn app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ (isUpdatableKycRequest
            ? 'verification-form.update-btn'
            : 'verification-form.create-btn'
          ) | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import VerificationFormMixin from '@/vue/mixins/verification-form.mixin'
import _get from 'lodash/get'

import { api } from '@/api'

import { uploadDocuments } from '@/js/helpers/upload-documents'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

import { BLOB_TYPES } from '@tokend/js-sdk'

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
      accountRoleToSet: vuexTypes.kycAccountRoleToSet,
      previousAccountRole: vuexTypes.kycPreviousRequestAccountRoleToSet,
    }),
    verificationCode () {
      return this.accountId.slice(1, 6)
    },
    isFormDisabled () {
      return !this.isAccountRoleReseted && this.kycState &&
        this.kycState !== REQUEST_STATES_STR.rejected &&
        this.kycState !== REQUEST_STATES_STR.permanentlyRejected
    },
    isFormPopulatable () {
      return this.isAccountRoleReseted
        ? this.previousAccountRole === this.kvEntryGeneralRoleId
        : this.accountRoleToSet === this.kvEntryGeneralRoleId
    },
  },

  created () {
    if (this.isFormPopulatable) {
      this.form = this.parseKycData(this.kycLatestRequestData)

      if (this.isFormDisabled) {
        this.disableForm()
      }
    }
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        await uploadDocuments(Object.values(this.form.documents))
        const kycBlobId = await this.createKycBlob(BLOB_TYPES.kycGeneral)
        const operation = this.createKycOperation(
          kycBlobId,
          this.kvEntryGeneralRoleId,
        )
        await api.postOperations(operation)
        do {
          await this.loadKyc()
          await this.delay(3000)
        } while (this.kycState !== REQUEST_STATES_STR.pending)
        Bus.success('verification-form.request-submitted-msg')
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },

    delay (ms) {
      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve, reject) => {
        resolve(setTimeout(resolve, ms))
      })
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
            DOCUMENT_TYPES.kycSelfie,
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

.verification-general-form__tag {
  margin-top: 1rem;
  background-color: $col-block-bg;
  padding: 2.4rem;

  @include box-shadow();
}

.verification-general-form__submit-btn {
  margin-right: auto;
  width: 100%;
  max-width: 20rem;
}

.verification-general-form__verification-code-btn {
  margin-top: 1.5rem;
}

.verification-general-form__account-info-title {
  color: $col-primary;
  font-size: 1.3rem;
}

.verification-general-form__block {
  &:not(:first-child) {
    .verification-general-form__tag > & {
      margin-top: 6rem;
    }
  }
}

.verification-general-form__block-label {
  font-size: 1.5rem;
  font-weight: 700;
}

.verification-general-form__photo-explanation {
  font-size: 1.5rem;
}
</style>
