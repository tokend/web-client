<template>
  <form
    class="app__form advanced-step-form"
    @submit.prevent="isFormValid() && setConfirmationState()"
  >
    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'update-asset-form.stellar-integration-subheading' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <!-- stellar integration is fully coming in 1.9.0 -->
        <tick-field
          class="advanced-step-form__stellar-integration-tick-field"
          v-model="form.isStellarIntegrationEnabled"
          :disabled="true || isDisabled"
          :cb-value="true"
        >
          {{ 'update-asset-form.integration-with-stellar-check' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isStellarIntegrationEnabled">
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.stellar.deposit"
            :disabled="isDisabled"
            :cb-value="true"
          >
            {{ 'update-asset-form.deposit-lbl' | globalize }}
          </tick-field>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.stellar.withdraw"
            :disabled="isDisabled"
            :cb-value="true"
          >
            {{ 'update-asset-form.withdraw-lbl' | globalize }}
          </tick-field>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.stellar.assetType"
            name="update-stellar-asset-type"
            :label="'update-asset-form.stellar-asset-type-lbl' | globalize"
            @blur="touchField('form.stellar.assetType')"
            :error-message="getFieldErrorMessage(
              'form.stellar.assetType',
            )"
            :disabled="isDisabled"
          >
            <option
              v-for="assetType in STELLAR_ASSET_TYPES"
              :key="assetType.value"
              :value="assetType.value"
            >
              {{ assetType.labelTranslationId | globalize }}
            </option>
          </select-field>
        </div>
      </div>

      <!-- eslint-disable max-len -->
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.stellar.assetCode"
            name="update-stellar-asset-code"
            :label="'update-asset-form.stellar-asset-code-lbl' | globalize"
            @blur="touchField('form.stellar.assetCode')"
            :error-message="getFieldErrorMessage('form.stellar.assetCode', {
              length: getAssetCodeMaxLength(),
              minLength: CREDIT_ALPHANUM12_MIN_LENGTH
            })"
            :disabled="isDisabled || !form.stellar.assetType ||
              form.stellar.assetType === STELLAR_TYPES.native
            "
          />
        </div>
      </div>
      <!-- eslint-enable max-len -->
    </template>

    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'update-asset-form.terms-subheading' | globalize }}
    </h3>
    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="form.terms"
          name="update-asset-terms"
          :note="'update-asset-form.terms-note' | globalize"
          :file-extensions="['jpg', 'png', 'pdf']"
          :document-type="DOCUMENT_TYPES.assetTerms"
          :label="'update-asset-form.terms-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation() || $emit(EVENTS.submit, form)"
        @cancel="hideConfirmation() || $emit(EVENTS.updateIsDisabled, false)"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="app__button-raised advanced-step-form__btn"
        :disabled="isDisabled"
      >
        {{ 'update-asset-form.update-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'
import { Asset } from '../wrappers/asset'
import {
  requiredIf,
  minLength,
  maxLength,
  alphaNum,
} from '@validators'

const EVENTS = {
  submit: 'submit',
  updateIsDisabled: 'update:isDisabled',
}

const STELLAR_ASSET_TYPES = [
  {
    labelTranslationId: 'update-asset-form.credit-alphanum4-stellar-asset-type-lbl',
    value: 'credit_alphanum4',
  },
  {
    labelTranslationId: 'update-asset-form.credit-alphanum12-stellar-asset-type-lbl',
    value: 'credit_alphanum12',
  },
  {
    labelTranslationId: 'update-asset-form.native-stellar-asset-type-lbl',
    value: 'native',
  },
]

const STELLAR_TYPES = {
  creditAlphanum4: 'credit_alphanum4',
  creditAlphanum12: 'credit_alphanum12',
  native: 'native',
}

const CREDIT_ALPHANUM4_MAX_LENGTH = 4
const CREDIT_ALPHANUM12_MIN_LENGTH = 5
const CREDIT_ALPHANUM12_MAX_LENGTH = 12
const NATIVE_XLM_TYPE = 'XLM'

export default {
  name: 'advanced-step-form',
  mixins: [FormMixin],
  props: {
    record: { type: [UpdateAssetRequest, Asset], required: true },
    isDisabled: { type: Boolean, default: false },
  },

  data: _ => ({
    form: {
      terms: null,
      stellar: {
        withdraw: false,
        deposit: false,
        assetType: '',
        assetCode: '',
      },
      isStellarIntegrationEnabled: false,
    },
    DOCUMENT_TYPES,
    EVENTS,
    STELLAR_ASSET_TYPES,
    STELLAR_TYPES,
    CREDIT_ALPHANUM12_MIN_LENGTH,
  }),

  validations () {
    let validations = {
      form: {
        stellar: {
          assetType: {
            required: requiredIf(function () {
              return this.form.isStellarIntegrationEnabled
            }),
          },
          assetCode: {
            required: requiredIf(function () {
              return this.form.isStellarIntegrationEnabled
            }),
          },
        },
      },
    }
    switch (this.form.stellar.assetType) {
      case STELLAR_TYPES.creditAlphanum4:
        validations.form.stellar.assetCode.maxLength = maxLength(
          CREDIT_ALPHANUM4_MAX_LENGTH
        )
        validations.form.stellar.assetCode.alphaNum = alphaNum
        break
      case STELLAR_TYPES.creditAlphanum12:
        validations.form.stellar.assetCode.minLength = minLength(
          CREDIT_ALPHANUM12_MIN_LENGTH
        )
        validations.form.stellar.assetCode.maxLength = maxLength(
          CREDIT_ALPHANUM12_MAX_LENGTH
        )
        validations.form.stellar.assetCode.alphaNum = alphaNum
        break
    }
    return validations
  },

  watch: {
    'form.stellar.assetType' (val) {
      if (val === STELLAR_TYPES.native) {
        this.form.stellar.assetCode = NATIVE_XLM_TYPE
      }
    },
  },

  created () {
    if (this.record) {
      this.populateForm()
    }
  },

  methods: {
    populateForm () {
      const isStellarIntegrationEnabled = this.record.stellarAssetCode !== ''
      this.form = {
        terms: this.record.termsKey
          ? new DocumentContainer(this.record.terms)
          : null,
        isStellarIntegrationEnabled: isStellarIntegrationEnabled,
        stellar: {
          withdraw: this.record.stellarWithdraw,
          deposit: this.record.stellarDeposit,
          assetType: this.record.stellarAssetType,
          assetCode: this.record.stellarAssetCode,
        },
      }
    },

    setConfirmationState () {
      this.showConfirmation()
      this.$emit(EVENTS.updateIsDisabled, true)
    },

    getAssetCodeMaxLength () {
      if (this.form.stellar.assetType === STELLAR_TYPES.creditAlphanum4) {
        return CREDIT_ALPHANUM4_MAX_LENGTH
        // eslint-disable-next-line max-len
      } else if (this.form.stellar.assetType === STELLAR_TYPES.creditAlphanum12) {
        return CREDIT_ALPHANUM12_MAX_LENGTH
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';

.advanced-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.advanced-step-form__subheading {
  margin: 2.4rem 0 0;

  & + .app__form-row {
    margin-top: 1.2rem;
  }
}
</style>
