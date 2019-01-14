<template>
  <form
    novalidate
    class="app-form verification-form"
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
          v-model="form.founded"
          :enable-time="false"
          @blur="touchField('form.founded')"
          id="verification-corporate-founded"
          :label="'verification-page.founded-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.founded')"
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
          :error-message="getFieldErrorMessage('form.teamSize')"
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
import { mapGetters } from 'vuex'

// import { Sdk } from '@/sdk'
// import { base, REQUEST_TYPES, ACCOUNT_TYPES } from '@tokend/js-sdk'

import { required } from '@validators'

// const KYC_LEVEL_TO_SET = 0

export default {
  name: 'verification-corporate-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      name: '',
      company: '',
      headquarters: '',
      industry: '',
      founded: '',
      teamSize: '0',
      website: ''
    }
  }),
  validations: {
    form: {
      name: { required },
      company: { required },
      headquarters: { required },
      industry: { required },
      founded: { required },
      teamSize: { required },
      website: { required }
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.kycLatestData,
      vuexTypes.kycState,
      vuexTypes.kycRequestId
    ])
  },
  created () {
    if (this[vuexTypes.kycLatestData].name) {
      this.setKycData()

      if (this[vuexTypes.kycState !== 'rejected']) {
        this.disableForm()
      }
    }
  },
  methods: {
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()

      // const operation =
      //   base.CreateUpdateKYCRequestBuilder.createUpdateKYCRequest({
      //     requestID: this.kycState === REQUEST_TYPES.rejected
      //       ? this.kycRequestId
      //       : '0',
      //     accountToUpdateKYC: this.accountId,
      //     accountTypeToSet: ACCOUNT_TYPES.syndicate,
      //     kycLevelToSet: KYC_LEVEL_TO_SET,
      //     kycData: { blob_id: blobId }
      //   })
      // await Sdk.horizon.transactions.submitOperations(operation)

      this.enableForm()
    },
    setKycData () {
      this.form.name = this[vuexTypes.kycLatestData].name
      this.form.company = this[vuexTypes.kycLatestData].company
      this.form.headquarters = this[vuexTypes.kycLatestData].headquarters
      this.form.industry = this[vuexTypes.kycLatestData].industry
      this.form.founded = this[vuexTypes.kycLatestData].found_date
      this.form.teamSize = this[vuexTypes.kycLatestData].team_size
      this.form.website = this[vuexTypes.kycLatestData].homepage
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

.verification-form {
  background-color: $col-block-bg;
  // FIXME
  box-shadow: 0 .6rem 1rem 0 rgba(0, 0, 0, 0.1);
  padding: 2.4rem;
}
</style>
