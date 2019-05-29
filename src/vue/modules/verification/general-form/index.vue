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
          {{ (Number(requestId) > 0
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

const EVENTS = {
  submit: 'submit',
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
  mixins: [FormMixin],
  props: {
    blobId: { type: String, default: '' },
    requestId: { type: String, required: true },

    generalRoleId: { type: String, required: true },
    usVerifiedRoleId: { type: String, required: true },
    usAccreditedRoleId: { type: String, required: true },
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
          ? this.usAccreditedRoleId
          : this.usVerifiedRoleId
      }

      return this.generalRoleId
    },
  },
  async created () {
    if (this.blobId) {
      try {
        this.populateForm(await this.getBlobData(this.blobId))
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }

      // Disabling country change to prevent updating role for
      // unfulfilled requests. Is temporary until canceling change
      // role requests is implemented on backend:
      this.isCountryChangeDisabled = true
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
        await this.uploadDocuments(this.accountId)
        const blobId = await this.createBlob(this.accountId)
        await this.createRequest(blobId)
        // we duplicating enabling form in try/catch blocks to prevent race
        // condition - the outer component disables the form after submit event
        // again and can does it before we enable it here.
        this.enableForm()
        this.$emit(EVENTS.submit)
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },
    async createRequest (blobId) {
      const operation = base.CreateChangeRoleRequestBuilder
        .createChangeRoleRequest({
          requestID: this.requestId,
          destinationAccount: this.accountId,
          accountRoleToSet: this.accountRoleToSet,
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
