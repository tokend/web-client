<template>
  <form class="app-form verification-form" @submit.prevent="submit">
    <div class="verification-form__block">
      <p class="verification-form__block-label">
        {{ 'verification-page.personal-details-lbl' | globalize }}
      </p>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.personal.firstName"
            @blur="touchField('form.personal.firstName')"
            id="verification-general-first-name"
            :label="'verification-page.first-name-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.personal.firstName')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.personal.lastName"
            @blur="touchField('form.personal.lastName')"
            id="verification-general-last-name"
            :label="'verification-page.last-name-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.personal.lastName')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <date-field
            v-model="form.personal.birthDate"
            :enable-time="false"
            @blur="touchField('form.personal.birthDate')"
            id="verification-general-birth-date"
            :label="'verification-page.birth-date-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.personal.birthDate')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <date-field
            v-model="form.personal.documentExpirationDate"
            :enable-time="false"
            @blur="touchField('form.personal.documentExpirationDate')"
            id="verification-general-document-expiration-date"
            :label="'verification-page.document-expiration-date-lbl'
              | globalize"
            :error-message="getFieldErrorMessage(
              'form.personal.documentExpirationDate'
            )"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.documents.idDocument"
            id="verification-general-id-document"
            :label="'verification-page.id-document-lbl' | globalize"
          />
        </div>
      </div>
    </div>

    <div class="verification-form__block">
      <p class="verification-form__block-label">
        {{ 'verification-page.address-details-lbl' | globalize }}
      </p>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.address.firstLine"
            @blur="touchField('form.address.firstLine')"
            id="verification-general-address-first-line"
            :label="'verification-page.address-first-line-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.address.firstLine')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.address.secondLine"
            @blur="touchField('form.address.secondLine')"
            id="verification-general-address-second-line"
            :label="'verification-page.address-second-line-lbl' | globalize"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.address.city"
            @blur="touchField('form.address.city')"
            id="verification-general-city"
            :label="'verification-page.city-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.address.city')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.address.country"
            @blur="touchField('form.address.country')"
            id="verification-general-country"
            :label="'verification-page.country-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.address.country')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.address.state"
            @blur="touchField('form.address.state')"
            id="verification-general-state"
            :label="'verification-page.state-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.address.state')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.address.postalCode"
            @blur="touchField('form.address.postalCode')"
            id="verification-general-postal-code"
            :label="'verification-page.postal-code-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.address.postalCode')"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.documents.proofDocument"
            id="verification-general-proof-document"
            :label="'verification-page.proof-document-lbl' | globalize"
          />
        </div>
      </div>
    </div>

    <div class="verification-form__block">
      <p class="verification-form__block-label">
        {{ 'verification-page.photo-verification-lbl' | globalize }}
      </p>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.documents.verificationPhoto"
            id="verification-general-verification-photo"
            :label="'verification-page.verification-photo-lbl' | globalize"
          />
        </div>
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

import { required } from '@validators'

export default {
  name: 'verification-general-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      personal: {
        firstName: '',
        lastName: '',
        birthDate: '',
        documentExpirationDate: ''
      },
      address: {
        firstLine: '',
        secondLine: '',
        city: '',
        country: '',
        state: '',
        postalCode: '0'
      },
      documents: {
        idDocument: null,
        proofDocument: null,
        verificationPhoto: null
      }
    }
  }),
  validations: {
    form: {
      personal: {
        firstName: { required },
        lastName: { required },
        birthDate: { required },
        documentExpirationDate: { required }
      },
      address: {
        firstLine: { required },
        city: { required },
        country: { required },
        state: { required },
        postalCode: { required }
      }
    }
  },
  methods: {
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()
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

  & > .verification-form__block:not(:first-child) {
    margin-top: 6rem;
  }
}

.verification-form__block-label {
  margin-bottom: -2.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
