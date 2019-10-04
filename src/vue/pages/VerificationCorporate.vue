<template>
  <div class="verification-corporate-form">
    <p class="verification-corporate-form__account-info-title">
      {{ 'verification-form.account-information-lbl' | globalize }}
    </p>
    <form
      novalidate
      class="app-form verification-corporate-form__tag"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.company"
            @blur="touchField('form.company')"
            name="verification-corporate-company"
            :label="'verification-form.company-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.company')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div
        v-if="!isKycRecoveryPage"
        class="app__form-row"
      >
        <div class="app__form-field">
          <file-field
            v-model="form.avatar"
            name="verification-corporate-avatar"
            :note="'verification-form.image-type-note' | globalize"
            :file-extensions="['jpg', 'png']"
            :document-type="DOCUMENT_TYPES.kycAvatar"
            :label="'verification-form.avatar-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.headquarters"
            name="verification-corporate-headquarters"
            :label="'verification-form.headquarters-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.industry"
            name="verification-corporate-industry"
            :label="'verification-form.industry-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.website"
            @blur="touchField('form.website')"
            name="verification-corporate-website"
            :label="'verification-form.website-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.website')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.cardNumber"
            @blur="touchField('form.cardNumber')"
            name="verification-corporate-card-number"
            :label="'verification-form.card-number-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.cardNumber')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.invite"
            name="verification-corporate-invitation-code"
            :label="'verification-form.invitation-code-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <span>
            {{ 'verification-form.description-lbl' | globalize }}
          </span>
          <markdown-field v-model="form.description" />
        </div>
      </div>

      <div class="app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          :is-pending="isFormSubmitting"
          @ok="submit"
          @cancel="hideConfirmation"
        />
        <button
          v-ripple
          v-else
          type="submit"
          class="verification-corporate-form__submit-btn app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ (isExistingRequest
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

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

import { BLOB_TYPES } from '@tokend/js-sdk'

import { uploadDocument } from '@/js/helpers/upload-documents'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { required, validateUrl, cardNumber } from '@validators'

const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

const EVENTS = {
  kycRecoverySubmit: 'kyc-recovery-submit',
}

export default {
  name: 'verification-corporate-form',
  mixins: [VerificationFormMixin],

  data: _ => ({
    form: {
      company: '',
      avatar: null,
      headquarters: '',
      industry: '',
      website: '',
      cardNumber: '',
      invite: '',
      description: '',
    },
    isFormSubmitting: false,
    DOCUMENT_TYPES,
  }),

  validations () {
    const websiteRule = {
      validateUrl,
    }

    const cardNumberRule = {
      cardNumber,
    }

    return {
      form: {
        company: { required },
        website: this.form.website ? websiteRule : {},
        cardNumber: this.form.cardNumber ? cardNumberRule : {},
      },
    }
  },

  computed: {
    ...mapGetters({
      kvEntryCorporateRoleId: vuexTypes.kvEntryCorporateRoleId,
      isAccountRoleReseted: vuexTypes.isAccountRoleReseted,
      accountRoleToSet: vuexTypes.kycAccountRoleToSet,
      previousAccountRole: vuexTypes.kycPreviousRequestAccountRoleToSet,
      kycRecoveryState: vuexTypes.kycRecoveryState,
      kycRecoveryRequestId: vuexTypes.kycRecoveryRequestId,
      kycRecoveryBlobId: vuexTypes.kycRecoveryBlobId,
      kycRecoveryRequestBlob: vuexTypes.kycRecoveryRequestBlob,
    }),

    isFormPopulatable () {
      return this.isAccountRoleReseted
        ? this.previousAccountRole === this.kvEntryCorporateRoleId
        : this.accountRoleToSet === this.kvEntryCorporateRoleId
    },
  },

  created () {
    if (this.isFormPopulatable && !this.isKycRecoveryPage) {
      this.form = this.parseKycData(this.kycLatestRequestData)
    } else if (
      this.kycRecoveryBlobId &&
      (this.kycRecoveryState !== REQUEST_STATES_STR.permanentlyRejected)
    ) {
      this.form = this.parseKycData(this.kycRecoveryRequestBlob)
    }
  },

  methods: {
    ...mapActions({
      sendKycRecoveryRequest: vuexTypes.SEND_KYC_RECOVERY_REQUEST,
    }),

    async submit () {
      if (!this.isFormValid()) return

      this.disableForm()
      this.isFormSubmitting = true

      try {
        if (!this.isKycRecoveryPage) await uploadDocument(this.form.avatar)

        const kycBlobId = await this.createKycBlob(BLOB_TYPES.kycCorporate)

        if (this.isKycRecoveryPage) {
          await this.sendKycRecoveryRequest(kycBlobId)
          this.$emit(EVENTS.kycRecoverySubmit)
        } else {
          const operation = this.createKycOperation(
            kycBlobId,
            this.kvEntryCorporateRoleId
          )

          await api.postOperations(operation)
          Bus.emit('updateAccountRole')
          await this.loadKyc()
          Bus.success('verification-form.request-submitted-msg')
        }
        this.scrollTop()
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.isFormSubmitting = false
      this.hideConfirmation()
      this.enableForm()
    },

    scrollTop () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    },

    createKycData () {
      return {
        company: this.form.company,
        headquarters: this.form.headquarters,
        industry: this.form.industry,
        homepage: this.form.website,
        description: this.form.description,
        documents: {
          [DOCUMENT_TYPES.kycAvatar]: this.form.avatar
            ? this.form.avatar.getDetailsForSave()
            : EMPTY_DOCUMENT,
        },
        bank_account: this.form.cardNumber ? this.form.cardNumber : null,
        invite: this.form.invite,
      }
    },

    parseKycData (kycData) {
      return {
        company: kycData.company,
        avatar: _get(kycData, `documents.${DOCUMENT_TYPES.kycAvatar}.key`)
          ? new DocumentContainer(kycData.documents[DOCUMENT_TYPES.kycAvatar])
          : null,
        headquarters: kycData.headquarters,
        industry: kycData.industry,
        description: kycData.description,
        website: kycData.homepage,
        cardNumber: kycData.bank_account,
        invite: kycData.invite,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.verification-corporate-form {
  margin-top: 4rem;
}

.verification-corporate-form__tag {
  margin-top: 1rem;
  background-color: $col-block-bg;
  padding: 2.4rem;

  @include box-shadow();
}

.verification-corporate-form__submit-btn {
  margin-right: auto;
  width: 100%;
  max-width: 20rem;
}

.verification-corporate-form__account-info-title {
  color: $col-primary;
  font-size: 1.3rem;
}
</style>
