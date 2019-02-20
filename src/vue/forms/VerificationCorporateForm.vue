<template>
  <div class="verification-corporate-form">
    <template v-if="isLoaded">
      <p class="verification-corporate-form__account-info-title">
        {{ 'verification-form.account-information-lbl' | globalize }}
      </p>

      <form
        novalidate
        class="app-form"
        @submit.prevent="isFormValid() && showConfirmation()"
      >
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.name"
              @blur="touchField('form.name')"
              id="verification-corporate-name"
              :label="'verification-form.name-lbl' | globalize"
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
              :label="'verification-form.company-lbl' | globalize"
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
              :label="'verification-form.headquarters-lbl' | globalize"
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
              :label="'verification-form.industry-lbl' | globalize"
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
              :label="'verification-form.found-date-lbl' | globalize"
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
              :label="'verification-form.team-size-lbl' | globalize"
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
              :label="'verification-form.website-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.website')"
              :disabled="formMixin.isDisabled"
            />
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
            class="verification-corporate-form__submit-btn"
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

import { Api } from '@/api'

import { ACCOUNT_ROLES } from '@/js/const/account-roles'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { BLOB_TYPES } from '@/js/const/blob-types.const'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { required, url, integer, minValue } from '@validators'

const MIN_TEAM_SIZE = 1

export default {
  name: 'verification-corporate-form',
  components: {
    Loader,
  },
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
    isLoaded: false,
    isLoadingFailed: false,
    accountRole: ACCOUNT_ROLES.syndicate,
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

  async created () {
    try {
      await this.loadAccount(this.accountId)
      await this.loadKyc()
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }

    if (this.kycState) {
      this.form = this.parseKycData(this.kycLatestData)
      if (this.kycState !== REQUEST_STATES_STR.rejected) {
        this.disableForm()
      }
    }
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        const kycBlobId = await this.createKycBlob(BLOB_TYPES.kycSyndicate)
        const operation = this.createKycOperation(kycBlobId)
        await Api.api.postOperations(operation)
        await this.loadKyc()
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },

    createKycData () {
      return {
        name: this.form.name,
        company: this.form.company,
        headquarters: this.form.headquarters,
        industry: this.form.industry,
        found_date: this.form.foundDate,
        team_size: this.form.teamSize,
        homepage: this.form.website,
      }
    },

    parseKycData (kycData) {
      return {
        name: kycData.name,
        company: kycData.company,
        headquarters: kycData.headquarters,
        industry: kycData.industry,
        foundDate: kycData.found_date,
        teamSize: kycData.team_size,
        website: kycData.homepage,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.verification-corporate-form {
  margin-top: 4rem;
}

.verification-corporate-form__submit-btn {
  @include button-raised();

  margin-right: auto;
  width: 100%;
  max-width: 20rem;
}

.verification-corporate-form__account-info-title {
  color: $col-primary;
  font-size: 1.3rem;
}

.verification-corporate-form {
  form {
    margin-top: 1rem;
    background-color: $col-block-bg;
    padding: 2.4rem;

    @include box-shadow();
  }
}
</style>
