<template>
  <div class="verification-general-form__section">
    <p class="verification-general-form__section-label">
      {{ 'general-form.address-details-lbl' | globalize }}
    </p>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="line1"
          @blur="touchField('line1')"
          name="verification-general-address-line-1"
          :label="'general-form.address-line-1-lbl' | globalize"
          :error-message="getFieldErrorMessage('line1')"
          :disabled="isDisabled"
        />
      </div>
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="line2"
          @blur="touchField('line2')"
          name="verification-general-address-line-2"
          :label="'general-form.address-line-2-lbl' | globalize"
          :error-message="getFieldErrorMessage('line2')"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="city"
          @blur="touchField('city')"
          name="verification-general-address-city"
          :label="'general-form.address-city-lbl' | globalize"
          :error-message="getFieldErrorMessage('city')"
          :disabled="isDisabled"
        />
      </div>
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="state"
          @blur="touchField('state')"
          name="verification-general-address-state"
          :label="'general-form.address-state-lbl' | globalize"
          :error-message="getFieldErrorMessage('state')"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="postalCode"
          @blur="touchField('postalCode')"
          name="verification-general-address-postal-code"
          :label="'general-form.address-postal-code-lbl' | globalize"
          :error-message="getFieldErrorMessage('postalCode')"
          :disabled="isDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SectionMixin from './section.mixin'

import { mapMutations } from 'vuex'
import { types } from '../store/types'
import { required } from '@validators'

export default {
  name: 'section-address',
  mixins: [FormMixin, SectionMixin],
  computed: {
    line1: {
      get () { return this.callGetter(types.line1) },
      set (v) { this.setLine1(v) },
    },
    line2: {
      get () { return this.callGetter(types.line2) },
      set (v) { this.setLine2(v) },
    },
    city: {
      get () { return this.callGetter(types.city) },
      set (v) { this.setCity(v) },
    },
    state: {
      get () { return this.callGetter(types.state) },
      set (v) { this.setState(v) },
    },
    postalCode: {
      get () { return this.callGetter(types.postalCode) },
      set (v) { this.setPostalCode(v) },
    },
  },
  validations: {
    line1: { required },
    line2: { required },
    city: { required },
    state: { required },
    postalCode: { required },
  },
  methods: {
    ...mapMutations('verification-general-form', {
      setLine1: types.SET_LINE_1,
      setLine2: types.SET_LINE_2,
      setCity: types.SET_CITY,
      setState: types.SET_STATE,
      setPostalCode: types.SET_POSTAL_CODE,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/styles';
</style>
