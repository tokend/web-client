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
          v-model="form.foundDate"
          :enable-time="false"
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
import { mapGetters, mapActions } from 'vuex'

import { Sdk } from '@/sdk'
import { ACCOUNT_TYPES, base } from '@tokend/js-sdk'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { BLOB_TYPES } from '@/js/const/blob-types.const'

import { KycTemplateParser } from '@/js/helpers/kyc-template-parser'

import { required, url } from '@validators'

const KYC_LEVEL_TO_SET = 0

export default {
  name: 'verification-corporate-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      name: '',
      company: '',
      headquarters: '',
      industry: '',
      foundDate: '',
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
      foundDate: { required },
      teamSize: { required },
      website: { required, url }
    }
  },
  computed: {
    ...mapGetters({
      kycLatestData: vuexTypes.kycLatestData,
      kycState: vuexTypes.kycState,
      kycRequestId: vuexTypes.kycRequestId,
      account: vuexTypes.account
    })
  },
  async created () {
    try {
      await this.loadKyc()
    } catch (error) {
      console.error(error)
    }
    if (this.kycLatestData.name) {
      this.form = KycTemplateParser.toTemplate(
        this.kycLatestData,
        ACCOUNT_TYPES.syndicate
      )

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

      const { data } = await Sdk.api.blobs.create(
        BLOB_TYPES.kycSyndicate,
        JSON.stringify(KycTemplateParser.fromTemplate(
          this.form,
          ACCOUNT_TYPES.syndicate
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
          accountTypeToSet: ACCOUNT_TYPES.syndicate,
          kycLevelToSet: KYC_LEVEL_TO_SET,
          kycData: kycData
        })
      await Sdk.horizon.transactions.submitOperations(operation)
      await this.loadKyc()
      this.enableForm()
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
