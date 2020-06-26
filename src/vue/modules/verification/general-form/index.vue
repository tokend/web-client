<template>
  <div class="verification-general-form__outer" v-if="isInitialized">
    <p class="verification-general-form__account-info-title">
      {{ 'general-form.account-information-lbl' | globalize }}
    </p>

    <form
      novalidate
      class="verification-general-form app-form"
      @submit.prevent="isAllFormsValid() && showConfirmation()"
    >
      <section-country
        :is-disabled="formMixin.isDisabled"
        :is-country-change-disabled="isCountryChangeDisabled"
        ref="country-form"
      />
      <section-personal
        :is-disabled="formMixin.isDisabled"
        ref="personal-form"
      />
      <section-address
        :is-disabled="formMixin.isDisabled"
        ref="address-form"
      />
      <section-documents
        :is-disabled="formMixin.isDisabled"
        ref="documents-form"
      />
      <section-selfie
        :is-disabled="formMixin.isDisabled"
        :verification-code="verificationCode"
        ref="selfie-form"
      />
      <section-avatar
        :is-disabled="formMixin.isDisabled"
        v-if="!isKycRecoveryPage"
        ref="section-avatar"
      />

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
import FormMixin from '@/vue/mixins/form.mixin'
import VerificationFormMixin from '@/vue/mixins/verification-form.mixin'

import SectionCountry from './components/section-country'
import SectionPersonal from './components/section-personal'
import SectionAddress from './components/section-address'
import SectionDocuments from './components/section-documents'
import SectionSelfie from './components/section-selfie'
import SectionAvatar from './components/section-avatar'

import { vuexTypes } from '@/vuex'
import { types } from './store/types'
import { mapActions, mapGetters } from 'vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { base } from '@tokend/js-sdk'
import { api } from '@/api'
import { isUSResidence } from './is-us-residence'
import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { keyValues } from '@/key-values'

const EVENTS = {
  submit: 'submit',
  kycRecoverySubmit: 'kyc-recovery-submit',
}

export default {
  name: 'verification-general-form',
  components: {
    SectionCountry,
    SectionPersonal,
    SectionAddress,
    SectionDocuments,
    SectionSelfie,
    SectionAvatar,
  },
  mixins: [FormMixin, VerificationFormMixin],
  props: {
    blobId: { type: String, default: '' },
  },
  data: _ => ({
    isInitialized: false,
    isCountryChangeDisabled: false,
  }),
  computed: {
    ...mapGetters('verification-general-form', {
      isAccredited: types.isAccredited,
      countryCode: types.countryCode,
      blobData: types.blobData,
      country: types.country,
    }),
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.kycRequestId,
      vuexTypes.kycRecoveryBlobId,
      vuexTypes.kycRecoveryState,
    ]),
    verificationCode () {
      return this.accountId.slice(1, 6)
    },
    isUSResident () {
      return isUSResidence(this.countryCode)
    },
    accountRoleToSet () {
      if (this.isUSResident) {
        return this.isAccredited
          ? keyValues.usAccreditedRoleId
          : keyValues.usVerifiedRoleId
      }

      return keyValues.generalRoleId
    },
  },
  async created () {
    try {
      if (this.blobId) {
        this.populateForm(await this.getBlobData(this.blobId))

        // Disabling country change to prevent updating role for
        // unfulfilled requests. Is temporary until canceling change
        // role requests is implemented on backend:
        this.isCountryChangeDisabled = true
      } else if (
        this.kycRecoveryBlobId &&
        (this.kycRecoveryState !== REQUEST_STATES_STR.permanentlyRejected)
      ) {
        this.populateForm(await this.getBlobData(
          this.kycRecoveryBlobId
        ))
      }
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
    this.isInitialized = true
  },
  methods: {
    ...mapActions('verification-general-form', {
      getBlobData: types.GET_BLOB_DATA,
      populateForm: types.POPULATE_STATE,
      uploadDocuments: types.UPLOAD_DOCUMENTS,
      createBlob: types.CREATE_BLOB,
    }),
    ...mapActions({
      sendKycRecoveryRequest: vuexTypes.SEND_KYC_RECOVERY_REQUEST,
    }),
    isAllFormsValid () {
      let isValid = true

      // we need to trigger errors in all sections,
      // even if we've already found invalid one
      Object.values(this.$refs).forEach(ref => {
        if (!ref.isFormValid()) {
          isValid = false
        }
      })

      return isValid
    },
    async submit () {
      this.disableForm()
      try {
        await this.uploadDocuments()
        const blobId = await this.createBlob(this.accountId)
        if (this.isKycRecoveryPage) {
          await this.sendKycRecoveryRequest(blobId)
          this.$emit(EVENTS.kycRecoverySubmit)
          this.enableForm()
        } else {
          await this.createKycVerificationRequest(blobId)
          // we duplicating enabling form in try/catch blocks to prevent race
          // condition - the outer component disables the form after submit
          // event again and can does it before we enable it here.
          this.enableForm()
          this.$emit(EVENTS.submit)
        }
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },
    async createKycVerificationRequest (blobId) {
      const operation = base.CreateChangeRoleRequestBuilder
        .createChangeRoleRequest({
          requestID: this.isExistingRequest ? String(this.kycRequestId) : '0',
          destinationAccount: this.accountId,
          accountRoleToSet: this.accountRoleToSet + '',
          creatorDetails: { blob_id: blobId },
        })

      await api.postOperations(operation)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './scss/styles';
</style>
