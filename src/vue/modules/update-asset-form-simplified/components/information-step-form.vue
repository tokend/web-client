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
          name="update-asset-name"
          :label="'update-asset-form-simplified.name-lbl' | globalize"
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
          name="update-asset-form-simplified-description"
          :label="'update-asset-form-simplified.description-lbl' | globalize"
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
          name="update-asset-form-price"
          :label="'update-asset-form-simplified.price-lbl' | globalize({
            quoteAsset: statsQuoteAsset.code
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
          {{ 'update-asset-form-simplified.transferable-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          name="update-asset-logo"
          v-model="form.logo"
          :note="'update-asset-form-simplified.logo-note' | globalize"
          :file-extensions="['jpg', 'png']"
          :document-type="DOCUMENT_TYPES.assetLogo"
          :label="'update-asset-form-simplified.logo-lbl' | globalize"
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
        {{ 'update-asset-form-simplified.update-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ASSET_POLICIES } from '@tokend/js-sdk'

import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { Asset } from '../wrappers/asset'

import {
  required,
  maxLength,
  amountRange,
} from '@validators'

import config from '@/config'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'
import { UpdateAssetRequest } from '../wrappers/update-asset-request'

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
    record: { type: [Asset, UpdateAssetRequest], default: null },
    isDisabled: { type: Boolean, default: false },
  },

  data: _ => ({
    form: {
      name: '',
      code: '',
      logo: null,
      policies: ASSET_POLICIES.canBeBaseInAtomicSwap,
      description: '',
      price: '',
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
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.statsQuoteAsset,
      vuexTypes.accountId,
    ]),
    inputStep () {
      return inputStepByDigitsCount(config.DECIMAL_POINTS)
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
        name: this.record.name,
        code: this.record.code,
        description: this.record.description,
        logo: this.record.logoKey
          ? new DocumentContainer(this.record.logo)
          : null,
        policies: this.record.policy,
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
</style>
