<template>
  <form
    novalidate
    class="app__form information-step-form"
    @submit.prevent="submit()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @blur="touchField('form.name')"
          name="create-asset-name"
          :label="'create-asset-form.name-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.name',
            { length: NAME_MAX_LENGTH }
          )"
          :maxlength="NAME_MAX_LENGTH"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.description"
          @blur="touchField('form.description')"
          name="create-asset-form-description"
          :label="'create-asset-form.description-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.description')"
          :maxlength="DESCRIPTION_MAX_LENGTH"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.price"
          type="number"
          :step="inputStep"
          :max="MAX_AMOUNT"
          @blur="touchField('form.price')"
          name="create-asset-form-price"
          :label="'create-asset-form.price-lbl' | globalize({
            quoteAsset: bussinessStatsQuoteAsset
          })"
          :error-message="getFieldErrorMessage('form.price', {
            from: {
              value: MIN_AMOUNT,
              currency: form.code,
            },
            to: {
              value: MAX_AMOUNT,
              currency: form.code,
            },
          })"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.policies"
          :cb-value="ASSET_POLICIES.transferable"
          :disabled="isDisabled"
        >
          {{ 'create-asset-form.transferable-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.isSellable"
          :disabled="isDisabled"
        >
          {{ 'create-asset-form.can-be-bought-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isSellable">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.amountToSell"
            type="number"
            :step="inputStep"
            :max="MAX_AMOUNT"
            @blur="touchField('form.amountToSell')"
            name="create-asset-form-amount-to-sell"
            :label="'create-asset-form.amount-to-sell-lbl' | globalize({
              quoteAsset: bussinessStatsQuoteAsset
            })"
            :error-message="getFieldErrorMessage('form.amountToSell', {
              from: {
                value: MIN_AMOUNT,
                currency: form.code,
              },
              to: {
                value: MAX_AMOUNT,
                currency: form.code,
              },
            })"
            :disabled="isDisabled"
          />
        </div>
      </div>
    </template>

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
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="app__button-raised information-step-form__btn"
        :disabled="isDisabled"
      >
        {{ 'create-asset-form.next-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import md5 from 'js-md5'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ASSET_POLICIES } from '@tokend/js-sdk'

import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import {
  required,
  maxLength,
  amountRange,
  requiredIf,
} from '@validators'

import config from '@/config'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'

const EVENTS = {
  submit: 'submit',
  updateIsDisabled: 'update:isDisabled',
}

const NAME_MAX_LENGTH = 255
const DESCRIPTION_MAX_LENGTH = 255

export default {
  name: 'information-step-form',
  mixins: [FormMixin],
  props: {
    request: { type: CreateAssetRequest, default: null },
    isDisabled: { type: Boolean, default: false },
    bussinessStatsQuoteAsset: { type: String, required: true },
  },

  data: _ => ({
    form: {
      name: '',
      code: '',
      logo: null,
      policies: ASSET_POLICIES.canBeBaseInAtomicSwap,
      description: '',
      isSellable: false,
      amountToSell: '',
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    ASSET_POLICIES,
    DOCUMENT_TYPES,
    NAME_MAX_LENGTH,
    DESCRIPTION_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        name: {
          required,
          maxLength: maxLength(NAME_MAX_LENGTH),
        },
        description: {
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
        price: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
        },
        amountToSell: {
          required: requiredIf(function () {
            return this.form.isSellable
          }),
          amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    inputStep () {
      return inputStepByDigitsCount(config.DECIMAL_POINTS)
    },
  },

  created () {
    if (this.request) {
      this.populateForm()
    }
  },

  methods: {
    getAssetCode () {
      let hash = md5.create()
      const assetInformation = this.form.name + this.accountId + +new Date()
      hash.update(assetInformation)
      return hash.toString().substring(0, 16).toUpperCase()
    },

    populateForm () {
      this.form = {
        name: this.request.assetName,
        code: this.request.assetCode,
        logo: this.request.logoKey
          ? new DocumentContainer(this.request.logo)
          : null,
        policies: this.request.policy,
      }
    },

    submit () {
      if (this.isFormValid()) {
        this.form.code = this.getAssetCode()
        this.$emit(EVENTS.submit, this.form)
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

.information-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.information-step-form__kyc-required-row {
  margin-top: 2.1rem;
}
</style>
