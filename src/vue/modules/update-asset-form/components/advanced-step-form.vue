<template>
  <form
    class="app__form advanced-step-form"
    @submit.prevent="isFormValid() && setConfirmationState()"
  >
    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'create-asset-form.stellar' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="advanced-step-form__stellar-integration-tick-field"
          v-model="form.isStellarIntegrationEnabled"
          :disabled="isDisabled || form.isErc20IntegrationEnabled"
          :cb-value="true"
        >
          {{ 'create-asset-form.integration-with-stellar' | globalize }}
        </tick-field>
      </div>
    </div>

    <template
      v-if="form.isStellarIntegrationEnabled && !form.isErc20IntegrationEnabled"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.stellar.deposit"
            :disabled="formMixin.isDisabled"
            :cb-value="true"
          >
            {{ 'create-asset-form.deposit-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.stellar.withdraw"
            :disabled="formMixin.isDisabled"
            :cb-value="true"
          >
            {{ 'create-asset-form.withdraw-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.stellar.assetType"
            name="create-asset-type"
            :label="'create-asset-form.stellar-type-lbl' | globalize"
            @blur="touchField('form.stellar.assetType')"
            :error-message="getFieldErrorMessage(
              'form.stellar.assetType',
            )"
            :disabled="isDisabled"
          >
            <option
              v-for="item in STELLAR_ASSET_TYPES"
              :value="item.value"
              :key="item.translationId"
            >
              {{ item.translationId | globalize }}
            </option>
          </select-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.stellar.assetCode"
            @blur="touchField('form.stellar.assetCode')"
            name="create-asset-stellar-code"
            :label="'create-asset-form.code-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.stellar.assetCode',
              {
                minLength: getAssetCodeMinLength,
                maxLength: getAssetCodeMaxLength
              }
            )"
            :disabled="isDisabled ||
              form.stellar.assetType === STELLAR_TYPES.native"
            :minlength="getAssetCodeMinLength"
            :maxlength="getAssetCodeMaxLength"
          />
        </div>
      </div>
    </template>

    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'create-asset-form.erc20' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="advanced-step-form__stellar-integration-tick-field"
          v-model="form.isErc20IntegrationEnabled"
          :disabled="isDisabled || form.isStellarIntegrationEnabled"
          :cb-value="true"
        >
          {{ 'create-asset-form.integration-with-erc20' | globalize }}
        </tick-field>
      </div>
    </div>

    <template
      v-if="form.isErc20IntegrationEnabled && !form.isStellarIntegrationEnabled"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.erc20.deposit"
            :disabled="formMixin.isDisabled"
            :cb-value="true"
          >
            {{ 'create-asset-form.deposit-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.erc20.withdraw"
            :disabled="formMixin.isDisabled"
            :cb-value="true"
          >
            {{ 'create-asset-form.withdraw-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.erc20.address"
            name="create-erc20-asset-code"
            :label="'create-asset-form.address-lbl' | globalize"
            @blur="touchField('form.erc20.address')"
            :error-message="getFieldErrorMessage('form.erc20.address')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
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
  maxLength,
  alphaNum,
  minLength,
} from '@validators'

import {
  STELLAR_TYPES,
  STELLAR_ASSET_TYPES,
  CREDIT_ALPHANUM4_MAX_LENGTH,
  CREDIT_ALPHANUM12_MIN_LENGTH,
  CREDIT_ALPHANUM12_MAX_LENGTH,
  NATIVE_XLM_TYPE,
} from '@/js/const/asset-subtypes.const'

const EVENTS = {
  submit: 'submit',
  updateIsDisabled: 'update:isDisabled',
}

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
      isStellarIntegrationEnabled: false,
      isErc20IntegrationEnabled: false,
      stellar: {
        withdraw: false,
        deposit: false,
        assetType: '',
        assetCode: '',
      },
      erc20: {
        withdraw: false,
        deposit: false,
        address: '',
      },
    },
    DOCUMENT_TYPES,
    EVENTS,
    STELLAR_ASSET_TYPES,
    CREDIT_ALPHANUM4_MAX_LENGTH,
    CREDIT_ALPHANUM12_MAX_LENGTH,
    CREDIT_ALPHANUM12_MIN_LENGTH,
    STELLAR_TYPES,
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
        erc20: {
          address: {
            required: requiredIf(function () {
              return this.form.isErc20IntegrationEnabled
            }),
          },
        },
      },
    }
    if (this.form.isStellarIntegrationEnabled) {
      const stellarAssetCode =
        validations.form.stellar.assetCode

      switch (this.form.stellar.assetType) {
        case STELLAR_TYPES.creditAlphanum4:
          stellarAssetCode.maxLength = maxLength(CREDIT_ALPHANUM4_MAX_LENGTH)
          stellarAssetCode.alphaNum = alphaNum
          break
        case STELLAR_TYPES.creditAlphanum12:
          stellarAssetCode.minLength = minLength(CREDIT_ALPHANUM12_MIN_LENGTH)
          stellarAssetCode.maxLength = maxLength(CREDIT_ALPHANUM12_MAX_LENGTH)
          stellarAssetCode.alphaNum = alphaNum
          break
      }
    }
    return validations
  },

  computed: {
    getAssetCodeMaxLength () {
      /* eslint-disable max-len */
      if (this.form.stellar.assetType === STELLAR_TYPES.creditAlphanum4) {
        return CREDIT_ALPHANUM4_MAX_LENGTH
      } else {
        return CREDIT_ALPHANUM12_MAX_LENGTH
      }
      /* eslint-enable max-len */
    },
    getAssetCodeMinLength () {
      if (this.form.stellar.assetType === STELLAR_TYPES.creditAlphanum4) {
        return CREDIT_ALPHANUM4_MAX_LENGTH
      } else {
        return CREDIT_ALPHANUM12_MIN_LENGTH
      }
    },
  },

  watch: {
    'form.stellar.assetType' (val) {
      if (val === STELLAR_TYPES.native) {
        this.form.stellar.assetCode = NATIVE_XLM_TYPE
      }
    },
    'form.isStellarIntegrationEnabled' (val) {
      if (val) this.form.isErc20IntegrationEnabled = false
    },
    'form.isErc20IntegrationEnabled' (val) {
      if (val) this.form.isStellarIntegrationEnabled = false
    },
  },

  created () {
    if (this.record) {
      this.populateForm()
    }
  },

  methods: {
    populateForm () {
      this.form = {
        terms: this.record.termsKey
          ? new DocumentContainer(this.record.terms)
          : null,
        isStellarIntegrationEnabled: this.record.isStellarIntegrationEnabled,
        isErc20IntegrationEnabled: this.record.isErc20IntegrationEnabled,
        stellar: {
          withdraw: this.record.stellarWithdraw,
          deposit: this.record.stellarDeposit,
          assetType: this.record.stellarAssetType,
          assetCode: this.record.stellarAssetCode,
        },
        erc20: {
          withdraw: this.record.erc20Withdraw,
          deposit: this.record.erc20Deposit,
          address: this.record.erc20Address,
        },
      }
    },

    setConfirmationState () {
      this.showConfirmation()
      this.$emit(EVENTS.updateIsDisabled, true)
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
  margin: 0;

  &:not(:first-of-type) {
    margin-top: 3.2rem;
  }

  & + .app__form-row {
    margin-top: 1.2rem;
  }
}
</style>
