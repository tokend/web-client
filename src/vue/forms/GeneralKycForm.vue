<template>
  <form
    novalidate
    class="app-form general-kyc-form"
    @submit.prevent="tryToSubmit()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          :white-autofill="!isSignUpKycPage"
          v-model="form.firstName"
          @blur="touchField('form.firstName')"
          name="general-kyc-first-name"
          :label="'general-kyc-form.first-name-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.firstName')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          :white-autofill="!isSignUpKycPage"
          v-model="form.lastName"
          @blur="touchField('form.lastName')"
          name="general-kyc-last-name"
          :label="'general-kyc-form.last-name-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.lastName')"
          :disabled="formMixin.isDisabled"
        />
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
        v-else
        v-ripple
        type="submit"
        class="general-kyc-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{
          (isSignUpKycPage
            ? 'general-kyc-form.login-btn'
            : 'general-kyc-form.update-btn'
          ) | globalize
        }}
      </button>
      <button
        v-if="isSignUpKycPage"
        type="button"
        @click="$emit(EVENTS.logout)"
        v-ripple
        class="general-kyc-form__submit-btn app__button-flat"
        :disabled="formMixin.isDisabled"
      >
        {{ 'general-kyc-form.logout-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import VerificationFormMixin from '@/vue/mixins/verification-form.mixin'

import { api } from '@/api'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { BLOB_TYPES } from '@tokend/js-sdk'

import { required } from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'

const EVENTS = {
  submitted: 'submitted',
  logout: 'logout',
}

export default {
  name: 'general-kyc-form',
  mixins: [VerificationFormMixin],

  data: _ => ({
    form: {
      firstName: '',
      lastName: '',
    },
    isFormSubmitting: false,
    EVENTS,
  }),

  validations: {
    form: {
      firstName: { required },
      lastName: { required },
    },
  },

  computed: {
    ...mapGetters({
      kvEntryGeneralRoleId: vuexTypes.kvEntryGeneralRoleId,
      isAccountRoleReseted: vuexTypes.isAccountRoleReseted,
      accountRoleToSet: vuexTypes.kycAccountRoleToSet,
      previousAccountRole: vuexTypes.kycPreviousRequestAccountRoleToSet,
    }),

    isFormPopulatable () {
      return this.isAccountRoleReseted
        ? this.previousAccountRole === this.kvEntryGeneralRoleId
        : this.accountRoleToSet === this.kvEntryGeneralRoleId
    },

    isSignUpKycPage () {
      return this.$route.name === vueRoutes.signupKyc.name
    },
  },

  created () {
    if (this.isFormPopulatable) {
      this.form = this.parseKycData(this.kycLatestRequestData)
    }
  },

  methods: {
    tryToSubmit () {
      if (!this.isFormValid()) return
      if (this.isSignUpKycPage) {
        this.submit()
      } else {
        this.showConfirmation()
      }
    },
    async submit () {
      this.disableForm()
      this.isFormSubmitting = true
      try {
        const kycBlobId = await this.createKycBlob(BLOB_TYPES.kycGeneral)
        const operation = this.createKycOperation(
          kycBlobId,
          this.kvEntryGeneralRoleId,
        )
        await api.postOperations(operation)
        await this.loadKyc()

        this.$emit(EVENTS.submitted)
      } catch (e) {
        this.isFormSubmitting = false
        this.hideConfirmation()
        ErrorHandler.process(e)
      }
      this.isFormSubmitting = false
      this.hideConfirmation()
    },

    createKycData () {
      return {
        first_name: this.form.firstName,
        last_name: this.form.lastName,
      }
    },

    parseKycData (kycData) {
      return {
        firstName: kycData.first_name,
        lastName: kycData.last_name,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';

.app__form-actions {
  display: flex;
  justify-content: space-between;
}
</style>
