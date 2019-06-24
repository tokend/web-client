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
            v-model="form.name"
            @blur="touchField('form.name')"
            name="verification-corporate-name"
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
            name="verification-corporate-company"
            :label="'verification-form.company-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.company')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
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
            @blur="touchField('form.headquarters')"
            name="verification-corporate-headquarters"
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
            name="verification-corporate-industry"
            :label="'verification-form.industry-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.industry')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            type="number"
            :min="MIN_TEAM_SIZE"
            :step="1"
            v-model="form.teamSize"
            @blur="touchField('form.teamSize')"
            name="verification-corporate-team-size"
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
            name="verification-corporate-website"
            :label="'verification-form.website-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.website')"
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
          v-ripple
          v-else
          type="submit"
          class="verification-corporate-form__submit-btn app__button-raised"
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

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { BLOB_TYPES } from '@tokend/js-sdk'

import { uploadDocument } from '@/js/helpers/upload-documents'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { required, validateUrl, integer, minValue } from '@validators'

const MIN_TEAM_SIZE = 1

const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

export default {
  name: 'verification-corporate-form',
  mixins: [VerificationFormMixin],

  data: _ => ({
    form: {
      name: '',
      company: '',
      avatar: null,
      headquarters: '',
      industry: '',
      teamSize: '0',
      website: '',
    },
    isFormSubmitting: false,
    MIN_TEAM_SIZE,
    DOCUMENT_TYPES,
  }),

  validations: {
    form: {
      name: { required },
      company: { required },
      headquarters: { required },
      industry: { required },
      teamSize: {
        required,
        integer,
        minValue: minValue(MIN_TEAM_SIZE),
      },
      website: {
        required,
        validateUrl,
      },
    },
  },

  computed: {
    ...mapGetters({
      kvEntryCorporateRoleId: vuexTypes.kvEntryCorporateRoleId,
      isAccountRoleReseted: vuexTypes.isAccountRoleReseted,
      accountRoleToSet: vuexTypes.kycAccountRoleToSet,
      previousAccountRole: vuexTypes.kycPreviousRequestAccountRoleToSet,
    }),
    isFormPopulatable () {
      return this.isAccountRoleReseted
        ? this.previousAccountRole === this.kvEntryCorporateRoleId
        : this.accountRoleToSet === this.kvEntryCorporateRoleId
    },
  },

  created () {
    if (this.isFormPopulatable) {
      this.form = this.parseKycData(this.kycLatestRequestData)
    }
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      this.isFormSubmitting = true
      try {
        await uploadDocument(this.form.avatar)
        const kycBlobId = await this.createKycBlob(BLOB_TYPES.kycCorporate)
        const operation = this.createKycOperation(
          kycBlobId,
          this.kvEntryCorporateRoleId
        )
        await api.postOperations(operation)
        do {
          await this.loadKyc()
          await this.delay(3000)
        } while (this.kycState !== REQUEST_STATES_STR.pending)

        Bus.success('verification-form.request-submitted-msg')
        this.scrollTop()
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isFormSubmitting = false
      this.hideConfirmation()
      this.enableForm()
    },

    delay (ms) {
      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve, reject) => {
        resolve(setTimeout(resolve, ms))
      })
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
        name: this.form.name,
        company: this.form.company,
        headquarters: this.form.headquarters,
        industry: this.form.industry,
        team_size: this.form.teamSize,
        homepage: this.form.website,
        documents: {
          [DOCUMENT_TYPES.kycAvatar]: this.form.avatar
            ? this.form.avatar.getDetailsForSave()
            : EMPTY_DOCUMENT,
        },
      }
    },

    parseKycData (kycData) {
      return {
        name: kycData.name,
        company: kycData.company,
        avatar: _get(kycData, `documents.${DOCUMENT_TYPES.kycAvatar}.key`)
          ? new DocumentContainer(kycData.documents[DOCUMENT_TYPES.kycAvatar])
          : null,
        headquarters: kycData.headquarters,
        industry: kycData.industry,
        teamSize: kycData.team_size,
        website: kycData.homepage,
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
