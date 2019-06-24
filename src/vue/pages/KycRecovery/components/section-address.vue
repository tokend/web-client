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
          name="verification-general-address-line-2"
          :label="'general-form.address-line-2-lbl' | globalize"
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

import { required } from '@validators'

export default {
  name: 'section-address',
  mixins: [FormMixin, SectionMixin],
  computed: {
    line1: {
      get () { return this.getData('address.line1') },
      set (v) { this.setData('address.line1', v) },
    },
    line2: {
      get () { return this.getData('address.line2') },
      set (v) { this.setData('address.line2', v) },
    },
    city: {
      get () { return this.getData('address.city') },
      set (v) { this.setData('address.city', v) },
    },
    state: {
      get () { return this.getData('address.state') },
      set (v) { this.setData('address.state', v) },
    },
    postalCode: {
      get () { return this.getData('address.postalCode') },
      set (v) { this.setData('address.postalCode', v) },
    },
  },
  validations: {
    line1: { required },
    city: { required },
    state: { required },
    postalCode: { required },
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/styles';
</style>
