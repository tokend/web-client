<template>
  <form class="app-form verification-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @blur="touchField('form.name')"
          id="verification-corporate-name"
          :label="'verification-page.name-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.name')"
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
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.teamSize"
          @blur="touchField('form.teamSize')"
          id="verification-corporate-teamSize"
          :label="'verification-page.team-size-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.teamSize')"
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

import { required } from '@validators'

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
      teamSize: 0,
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
}
</style>
