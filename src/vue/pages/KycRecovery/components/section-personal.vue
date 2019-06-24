<template>
  <div class="verification-general-form__section">
    <p class="verification-general-form__section-label">
      {{ 'general-form.personal-details-lbl' | globalize }}
    </p>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="firstName"
          @blur="touchField('firstName')"
          name="verification-general-first-name"
          :label="'general-form.first-name-lbl' | globalize"
          :error-message="getFieldErrorMessage('firstName')"
          :disabled="isDisabled"
        />
      </div>
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="lastName"
          @blur="touchField('lastName')"
          name="verification-general-last-name"
          :label="'general-form.last-name-lbl' | globalize"
          :error-message="getFieldErrorMessage('lastName')"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <date-field
          v-model="dateOfBirth"
          name="verification-general-date-of-birth"
          :enable-time="false"
          allow-input
          :placeholder="'general-form.date-of-birth-placeholder' | globalize"
          :disable-after="moment().toString()"
          @input="touchField('dateOfBirth')"
          @blur="touchField('dateOfBirth')"
          :label="'general-form.date-of-birth-lbl' | globalize"
          :error-message="getFieldErrorMessage('dateOfBirth')"
          :disabled="isDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SectionMixin from './section.mixin'

import { required } from '@validators'

import moment from 'moment'

export default {
  name: 'section-personal',
  mixins: [FormMixin, SectionMixin],
  data: _ => ({
    moment,
  }),
  computed: {
    firstName: {
      get () { return this.getData('personal.firstName') },
      set (v) { this.setData('personal.firstName', v) },
    },
    lastName: {
      get () { return this.getData('personal.lastName') },
      set (v) { this.setData('personal.lastName', v) },
    },
    dateOfBirth: {
      get () { return this.getData('personal.dateOfBirth') },
      set (v) { this.setData('personal.dateOfBirth', v) },
    },
  },
  validations: {
    firstName: { required },
    lastName: { required },
    dateOfBirth: { required },
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/styles';
</style>
