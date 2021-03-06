<template>
  <div class="country-section">
    <h4 class="country-section__title">
      {{ 'general-form.country-details-lbl' | globalize }}
    </h4>

    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="countryCode"
          name="address-country"
          :label="'general-form.address-country-lbl' | globalize"
          @input="touchField('countryCode');
                  former.setAttr('address.country', countryCode)"
          :error-message="getFieldErrorMessage('countryCode')"
          :disabled="isDisabled || isDisabledCountryChange"
        >
          <option
            v-for="item in COUNTRIES"
            :key="item"
            :value="item"
          >
            {{ item | globalizeCountry }}
          </option>
        </select-field>
      </div>
    </div>

    <template v-if="isUSResident">
      <p class="country-section__usa-warning-msg">
        {{ 'general-form.usa-warning-msg' | globalize }}
      </p>

      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="isAccredited"
            :disabled="isDisabled"
          >
            {{ 'general-form.i-am-accredited-lbl' | globalize }}
          </tick-field>
        </div>
      </div>

      <template v-if="isAccredited">
        <div
          class="app__form-row"
          v-if="isAccredited"
        >
          <div class="app__form-field">
            <p class="country-section__usa-accredited-explain-msg">
              {{ 'general-form.usa-accredited-exp-msg' | globalize }}
            </p>

            <file-field
              v-model="proofOfInvestor"
              @input="former.setAttr('proofOfInvestor', proofOfInvestor)"
              name="verification-general-proof-of-investor"
              :note="'general-form.file-type-note' | globalize"
              :file-extensions="['jpg', 'png', 'pdf']"
              :document-type="$DOCUMENT_TYPES.kycProofOfInvestor"
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
import formMixin from '@/vue/mixins/form.mixin'
import { required, requiredIf } from '@validators'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'
import { isUSResidence, isRoleUnset } from '@/js/helpers/kyc-helpers'

import { COUNTRIES } from '@/js/const/countries'
import { Document } from '@tokend/js-sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'country-section',

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
  },

  data () {
    const attrs = this.former.attrs || {}
    const country = (attrs.address || {}).country || ''
    const isAccredited =
      attrs.proofOfInvestor instanceof Document &&
      attrs.proofOfInvestor.isUploaded
    return {
      countryCode: country,
      isDisabledCountryChange: Boolean(country),
      proofOfInvestor: attrs.proofOfInvestor || null,
      isAccredited: isAccredited || false,
      COUNTRIES,
    }
  },

  validations: {
    countryCode: { required },
    proofOfInvestor: {
      required: requiredIf(function () { return this.isAccredited }),
    },
  },

  computed: {
    ...mapGetters({
      kycRequest: vuexTypes.kycRequest,
    }),

    isUSResident () {
      return isUSResidence(this.countryCode)
    },
  },

  created () {
    this.$watch(
      () => ([this.isUSResident, this.isAccredited]),
      () => {
        if (!this.isUSResident || !this.isAccredited) {
          this.former.unsetAttr('proofOfInvestor')
          return
        }

        if (this.isUSResident && this.isAccredited) {
          this.former.setAttr('proofOfInvestor', this.proofOfInvestor)
        }
      })
    this.$watch(
      'kycRequest',
      () => {
        if (isRoleUnset(this.kycRequest)) {
          this.isDisabledCountryChange = false
        } else if (this.kycRequest.isExists && this.countryCode) {
          this.isDisabledCountryChange = true
        }
      },
      { immediate: true },
    )
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/_app-form';

.country-section__usa-warning-msg {
  color: $col-warning;
  margin-top: 0.5rem;
}

.country-section__usa-accredited-explain-msg {
  margin-bottom: 1rem;
  color: $col-text-secondary;
  font-style: italic;
}
</style>
