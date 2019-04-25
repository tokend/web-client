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
import GetterAccessorMixin from './getter-accessor'

import { mapMutations } from 'vuex'
import { types } from '../store/types'
import { required } from '@validators'

import moment from 'moment'

export default {
  name: 'section-personal',
  mixins: [FormMixin, SectionMixin, GetterAccessorMixin],
  data: _ => ({
    moment,
  }),
  computed: {
    firstName: {
      get () { return this.getter(types.firstName) },
      set (v) { this.setFirstName(v) },
    },
    lastName: {
      get () { return this.getter(types.lastName) },
      set (v) { this.setLastName(v) },
    },
    dateOfBirth: {
      get () { return this.getter(types.dateOfBirth) },
      set (v) { this.setDateOfBirth(v) },
    },
  },
  validations: {
    firstName: { required },
    lastName: { required },
    dateOfBirth: { required },
  },
  methods: {
    ...mapMutations('verification-general-form', {
      setLastName: types.SET_LAST_NAME,
      setFirstName: types.SET_FIRST_NAME,
      setDateOfBirth: types.SET_DATE_OF_BIRTH,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/styles';
</style>
