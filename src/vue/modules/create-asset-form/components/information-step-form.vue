<template>
  <form
    novalidate
    class="app__form information-step-form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        {{ 'create-asset-form.corn-name' | globalize }}: {{ form.name }}
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        {{ 'create-asset-form.corn-code' | globalize }}: {{ form.code }}
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="form.cornType"
          name="create-corn-types"
          key-as-value-text="labelTranslationId"
          :is-value-translatable="true"
          :values="cornTypes"
          :label="'create-asset-form.corn-type' | globalize"
          @blur="touchField('form.cornType')"
          :error-message="getFieldErrorMessage(
            'form.cornType',
          )"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="form.cornClass"
          name="create-corn-class"
          :values="cornClasses"
          :label="'create-asset-form.corn-class' | globalize"
          @blur="touchField('form.cornClass')"
          :error-message="getFieldErrorMessage(
            'form.cornClass',
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          name="create-asset-logo"
          v-model="form.logo"
          :note="'create-asset-form.logo-note' | globalize"
          :file-extensions="['jpg', 'png']"
          :document-type="DOCUMENT_TYPES.assetLogo"
          :label="'create-asset-form.logo-lbl' | globalize"
          :min-width="120"
          :min-height="120"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="app__button-raised information-step-form__btn"
      >
        {{ 'create-asset-form.next-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ASSET_POLICIES } from '@tokend/js-sdk'
import { CORN_TYPE, CORN_CLASS } from '@/js/const/corn'

import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import { required } from '@validators'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

import config from '@/config'

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
    kycRequiredAssetType: { type: Number, required: true },
    securityAssetType: { type: Number, required: true },
  },

  data: _ => ({
    form: {
      name: '',
      code: '',
      maxIssuanceAmount: config.MAX_AMOUNT,
      logo: null,
      policies: ASSET_POLICIES.transferable + ASSET_POLICIES.withdrawable,
      assetType: '',
      cornType: '',
      cornClass: '',
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
        cornType: {
          required,
        },
        cornClass: {
          required,
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      kycLatestData: vuexTypes.kycLatestData,
    }),
    assetTypes () {
      return [
        {
          labelTranslationId: 'create-asset-form.verification-not-required-lbl',
          value: 0,
        },
        {
          labelTranslationId: 'create-asset-form.verification-required-lbl',
          value: this.kycRequiredAssetType,
        },
        {
          labelTranslationId: 'create-asset-form.security-asset-lbl',
          value: this.securityAssetType,
        },
      ]
    },
    cornTypes () {
      return [
        {
          labelTranslationId: 'create-asset-form.wheat',
          value: CORN_TYPE.wheat,
        },
        {
          labelTranslationId: 'create-asset-form.corn',
          value: CORN_TYPE.corn,
        },
      ]
    },
    cornClasses () {
      return CORN_CLASS[this.form.cornType.value]
    },
  },

  watch: {
    'form.cornType' () {
      this.form.cornClass = this.cornClasses[0]
      this.setCornTypeClass()
    },
    'form.cornClass' () {
      this.setCornTypeClass()
    },
  },

  created () {
    if (this.request) {
      this.populateForm()
    } else {
      this.form.assetType = this.assetTypes[1]
      this.form.cornType = this.cornTypes[0]
      this.setCornTypeClass()
    }
  },
  methods: {
    setCornTypeClass () {
      this.form.name = this.kycLatestData.elevator_code + '-' +
        this.form.cornType.value + '-' + this.form.cornClass
      this.form.code = this.kycLatestData.elevator_code +
        this.form.cornType.value[0].toUpperCase() + this.form.cornClass
      this.form.elevatorCode = this.kycLatestData.elevator_code
    },
    populateForm () {
      this.form = {
        name: this.request.assetName,
        code: this.request.assetCode,
        cornType: this.request.cornType,
        cornClass: this.request.cornClass,
        elevatorCode: this.request.elevatorCode,
        assetType: this.assetTypes
          .find(item => item.value === this.request.assetType),
        maxIssuanceAmount: this.request.maxIssuanceAmount,
        logo: this.request.logoKey
          ? new DocumentContainer(this.request.logo)
          : null,
        policies: this.request.policy,
      }
    },

    submit () {
      if (this.isFormValid()) {
        this.$emit(EVENTS.submit, this.form)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';

.information-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.information-step-form__kyc-required-row {
  margin-top: 2.1rem;
}
</style>
