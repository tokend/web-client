<template>
  <div class="address-section">
    <h4 class="address-section__title">
      {{ 'general-form.address-details-lbl' | globalize }}
    </h4>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          :white-autofill="whiteAutofill"
          v-model="line1"
          @change="former.setAttr('address.line1', line1)"
          @blur="touchField('line1')"
          name="verification-general-address-line-1"
          :label="'general-form.address-line-1-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
      <div class="app__form-field">
        <input-field
          :white-autofill="whiteAutofill"
          v-model="line2"
          @change="former.setAttr('address.line2', line2)"
          name="verification-general-address-line-2"
          :label="'general-form.address-line-2-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          :white-autofill="whiteAutofill"
          v-model="city"
          @change="former.setAttr('address.city', city)"
          @blur="touchField('city')"
          name="verification-general-address-city"
          :label="'general-form.address-city-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
      <div class="app__form-field">
        <input-field
          :white-autofill="whiteAutofill"
          v-model="state"
          @change="former.setAttr('address.state', state)"
          @blur="touchField('state')"
          name="verification-general-address-state"
          :label="'general-form.address-state-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          :white-autofill="whiteAutofill"
          v-model="postalCode"
          @change="former.setAttr('address.postalCode', postalCode)"
          @blur="touchField('postalCode')"
          name="verification-general-address-postal-code"
          :label="'general-form.address-postal-code-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
      <div class="app__form-field">
        <input-field
          :white-autofill="whiteAutofill"
          v-model="country"
          @change="former.setAttr('address.country', country)"
          label="Country"
          :disabled="isDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'

export default {
  name: 'address-section',

  mixins: [formMixin],

  props: {
    former: {
      type: KycGeneralFormer,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: true,
    },
    whiteAutofill: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    const addressAttrs = this.former.attrs.address || {}
    return {
      line1: addressAttrs.line1 || '',
      line2: addressAttrs.line2 || '',
      city: addressAttrs.city || '',
      state: addressAttrs.state || '',
      postalCode: addressAttrs.postalCode || '',
      country: addressAttrs.country || '',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/_app-form';
</style>
