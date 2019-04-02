<template>
  <form
    novalidate
    class="app__form information-step-form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @blur="touchField('form.name')"
          id="asset-name"
          name="asset-create-name"
          :label="'asset-form.name-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.name',
            { length: NAME_MAX_LENGTH }
          )"
          :maxlength="NAME_MAX_LENGTH"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.code"
          @blur="touchField('form.code')"
          id="asset-code"
          name="asset-create-asset-code"
          :label="'asset-form.code-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.code',
            { length: CODE_MAX_LENGTH }
          )"
          :maxlength="CODE_MAX_LENGTH"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          type="number"
          v-model="form.maxIssuanceAmount"
          @blur="touchField('form.maxIssuanceAmount')"
          id="asset-max-issuance-amount"
          name="asset-create-max-issuance-amount"
          :label="'asset-form.max-issuance-amount-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.maxIssuanceAmount',
            { from: MIN_AMOUNT, to: MAX_AMOUNT }
          )"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="form.assetType"
          name="asset-create-asset-type"
          key-as-value-text="labelTranslationId"
          :is-value-translatable="true"
          :values="assetTypes"
          :label="'asset-form.asset-type' | globalize"
          :disabled="formMixin.isDisabled"
          @blur="touchField('form.assetType')"
          :error-message="getFieldErrorMessage(
            'form.assetType',
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.policies"
          :disabled="formMixin.isDisabled"
          :cb-value="ASSET_POLICIES.transferable"
        >
          {{ 'asset-form.transferable-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.policies"
          :disabled="formMixin.isDisabled"
          :cb-value="ASSET_POLICIES.withdrawable"
        >
          {{ 'asset-form.withdrawable-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          name="asset-create-logo"
          v-model="form.logo"
          :note="'asset-form.logo-note' | globalize"
          accept=".jpg, .png"
          :document-type="DOCUMENT_TYPES.assetLogo"
          :label="'asset-form.logo-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="app__button-raised information-step-form__btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'asset-form.next-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ASSET_POLICIES } from '@tokend/js-sdk'

import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import { required, amountRange, maxLength } from '@validators'

import config from '../_config'

const EVENTS = {
  submit: 'submit',
}

const CODE_MAX_LENGTH = 16
const NAME_MAX_LENGTH = 255

export default {
  name: 'information-step-form',
  mixins: [FormMixin],
  props: {
    request: { type: CreateAssetRequest, default: null },
    kycRequiredAssetType: { type: String, required: true },
  },

  data: _ => ({
    form: {
      name: '',
      code: '',
      maxIssuanceAmount: '',
      logo: null,
      policies: 0,
      assetType: '',
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    ASSET_POLICIES,
    DOCUMENT_TYPES,
    CODE_MAX_LENGTH,
    NAME_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        name: {
          required,
          maxLength: maxLength(NAME_MAX_LENGTH),
        },
        code: {
          required,
          maxLength: maxLength(CODE_MAX_LENGTH),
        },
        maxIssuanceAmount: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
        },
        assetType: {
          required,
        },
      },
    }
  },

  computed: {
    assetTypes () {
      return [
        {
          labelTranslationId: 'asset-form.asset-type-not-required-kyc',
          value: '0',
        },
        {
          labelTranslationId: 'asset-form.asset-type-required-kyc',
          value: this.kycRequiredAssetType,
        },
      ]
    },
  },

  created () {
    if (this.request) {
      this.populateForm()
    }
  },

  methods: {
    submit () {
      if (this.isFormValid()) {
        this.$emit(EVENTS.submit, this.form)
      }
    },

    populateForm () {
      this.form = {
        name: this.request.assetName,
        code: this.request.assetCode,
        assetType: this.assetTypes
          .find(item => {
            return item.value === String(this.request.assetType)
          }),
        maxIssuanceAmount: this.request.maxIssuanceAmount,
        logo: this.request.logo.key
          ? new DocumentContainer(this.request.logo)
          : null,
        policies: this.request.policy,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../scss/form';

.information-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.information-step-form__kyc-required-row {
  margin-top: 2.1rem;
}
</style>
