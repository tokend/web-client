<template>
  <div class="personal-section">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="firstName"
          @change="former.setAttr('firstName', firstName)"
          @blur="touchField('firstName')"
          name="verification-general-first-name"
          :label="'general-form.first-name-lbl' | globalize"
          :disabled="isDisabled"
          :white-autofill="whiteAutofill"
        />
      </div>
      <div class="app__form-field">
        <input-field
          v-model="lastName"
          @change="former.setAttr('lastName', lastName)"
          @blur="touchField('lastName')"
          name="verification-general-last-name"
          :label="'general-form.last-name-lbl' | globalize"
          :disabled="isDisabled"
          :white-autofill="whiteAutofill"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <date-field
          v-model="dateOfBirth"
          @input="touchField('dateOfBirth');
                  former.setAttr('dateOfBirth', dateOfBirth)"
          name="verification-general-date-of-birth"
          :enable-time="false"
          allow-input
          :placeholder="'general-form.date-of-birth-placeholder' | globalize"
          :disable-after="new Date().toISOString()"
          :label="'general-form.date-of-birth-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
      <div class="app__form-field">
        <input-field
          v-model="taxId"
          @change="former.setAttr('taxId', taxId)"
          label="Tax Id"
          :disabled="isDisabled"
          :white-autofill="whiteAutofill"
        />
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'

export default {
  name: 'personal-section',

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
    return {
      firstName: this.former.attrs.firstName || '',
      lastName: this.former.attrs.lastName || '',
      dateOfBirth: this.former.attrs.dateOfBirth || '',
      taxId: this.former.attrs.taxId || '',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/_app-form';
</style>
