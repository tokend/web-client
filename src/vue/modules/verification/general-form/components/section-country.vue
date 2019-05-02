<template>
  <div class="verification-general-form__section">
    <p class="verification-general-form__section-label">
      {{ 'general-form.country-details-lbl' | globalize }}
    </p>

    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="country"
          name="id-document-type"
          key-as-value-text="translation"
          :is-value-translatable="false"
          :values="COUNTRIES"
          :label="'general-form.address-country-lbl' | globalize"
          @blur="touchField('country')"
          :error-message="getFieldErrorMessage('country')"
          :disabled="isDisabled || isCountryChangeDisabled"
        />
      </div>
    </div>

    <template v-if="isUSResident">
      <p class="verification-general-form__usa-warning-msg">
        {{ 'general-form.usa-warning-msg' | globalize }}
      </p>

      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="isAccredited"
            :disabled="isDisabled || isCountryChangeDisabled"
          >
            {{ 'general-form.i-am-accredited-lbl' | globalize }}
          </tick-field>
        </div>
      </div>

      <template v-if="isAccredited">
        <div class="app__form-row" v-if="isAccredited">
          <div class="app__form-field">
            <p class="verification-general-form__usa-accredited-explain-msg">
              {{ 'general-form.usa-accredited-exp-msg' | globalize }}
            </p>

            <file-field
              v-model="proofOfInvestor"
              name="verification-general-proof-of-investor"
              :note="'general-form.file-type-note' | globalize"
              :file-extensions="['jpg', 'png', 'pdf']"
              :document-type="DOCUMENT_TYPES.kycProofOfInvestor"
              :label="'general-form.document-poi-lbl' | globalize"
              :disabled="isDisabled"
              :error-message="getFieldErrorMessage('proofOfInvestor')"
            />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SectionMixin from './section.mixin'

import { COUNTRIES } from '../countries'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { mapGetters, mapMutations } from 'vuex'
import { required, requiredIf } from '@validators'
import { types } from '../store/types'
import { isUSResidence } from '../is-us-residence'

export default {
  name: 'section-country',
  mixins: [FormMixin, SectionMixin],
  props: {
    isCountryChangeDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data: _ => ({
    COUNTRIES,
    DOCUMENT_TYPES,
  }),
  validations: {
    country: { required },
    proofOfInvestor: {
      required: requiredIf(function () {
        return this.isAccredited
      }),
    },
  },
  computed: {
    ...mapGetters('verification-general-form', {
      countryCode: types.countryCode,
    }),
    isAccredited: {
      get () { return this.callGetter(types.isAccredited) },
      set (v) { this.setIsAccredited(v) },
    },
    country: {
      get () { return this.callGetter(types.country) },
      set (v) { this.setCountry(v) },
    },
    proofOfInvestor: {
      get () { return this.callGetter(types.proofOfInvestor) },
      set (v) { this.setProofOfInvestor(v) },
    },
    isUSResident () {
      return isUSResidence(this.countryCode)
    },
  },
  methods: {
    ...mapMutations('verification-general-form', {
      setCountry: types.SET_COUNTRY,
      setProofOfInvestor: types.SET_PROOF_OF_INVESTOR,
      setIsAccredited: types.SET_IS_ACCREDITED,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/styles';

.verification-general-form__usa-warning-msg {
  color: $col-warning;
  margin-top: 0.5rem;
}

.verification-general-form__usa-accredited-explain-msg {
  margin-bottom: 1rem;
  color: $col-text-secondary;
  font-style: italic;
}
</style>
