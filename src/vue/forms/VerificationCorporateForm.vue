<template>
  <form
    novalidate
    class="app-form verification-corporate-form"
    @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @blur="touchField('form.name')"
          id="verification-corporate-name"
          :label="'verification-page.name-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.name')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.company"
          @blur="touchField('form.company')"
          id="verification-corporate-company"
          :label="'verification-page.company-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.company')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.headquarters"
          @blur="touchField('form.headquarters')"
          id="verification-corporate-headquarters"
          :label="'verification-page.headquarters-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.headquarters')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.industry"
          @blur="touchField('form.industry')"
          id="verification-corporate-industry"
          :label="'verification-page.industry-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.industry')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <date-field
          v-model="form.foundDate"
          :enable-time="false"
          :disable-after="new Date().toString()"
          @blur="touchField('form.foundDate')"
          id="verification-corporate-found-date"
          :label="'verification-page.found-date-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.foundDate')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          type="number"
          v-model="form.teamSize"
          @blur="touchField('form.teamSize')"
          id="verification-corporate-teamSize"
          :label="'verification-page.team-size-lbl' | globalize"
          :error-message="
            getFieldErrorMessage('form.teamSize', { value: MIN_TEAM_SIZE})
          "
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
          id="verification-corporate-website"
          :label="'verification-page.website-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.website')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="verification-corporate-form__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'verification-page.submit-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import VerificationFormMixin from '@/vue/mixins/verification-form.mixin'

import { Sdk } from '@/sdk'
import { ACCOUNT_TYPES } from '@tokend/js-sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { required, url, integer, minValue } from '@validators'

const MIN_TEAM_SIZE = 1

export default {
  name: 'verification-corporate-form',
  mixins: [VerificationFormMixin],
  data: _ => ({
    form: {
      name: '',
      company: '',
      headquarters: '',
      industry: '',
      foundDate: '',
      teamSize: '0',
      website: '',
    },
    accountType: ACCOUNT_TYPES.syndicate,
    MIN_TEAM_SIZE,
  }),
  validations: {
    form: {
      name: { required },
      company: { required },
      headquarters: { required },
      industry: { required },
      foundDate: { required },
      teamSize: {
        required,
        integer,
        minValue: minValue(MIN_TEAM_SIZE),
      },
      website: { required, url },
    },
  },
  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        const kycData = await this.createKycData()
        const operation = this.createKycOperation(kycData)
        await Sdk.horizon.transactions.submitOperations(operation)
        await this.loadKyc()
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
        this.enableForm()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.verification-corporate-form__submit-btn {
  @include button-raised();

  margin-right: auto;
  margin-bottom: 2rem;
  width: 20rem;
}

.verification-corporate-form {
  background-color: $col-block-bg;
  box-shadow: 0 .6rem 1rem 0 $col-block-shadow;
  padding: 2.4rem;
}
</style>
