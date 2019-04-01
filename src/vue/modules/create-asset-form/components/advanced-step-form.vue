<template>
  <form
    class="app__form advanced-step-form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.isPreissuanceDisabled"
          :disabled="formMixin.isDisabled"
        >
          {{ 'asset-form.additional-issuance-check' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="!form.isPreissuanceDisabled">
      <div class="app__form-row">
        <div class="app__form-field">
          <div class="issuance-form__pre-issued-asset-signer-wrp">
            <input-field
              white-autofill
              v-model="form.preissuedAssetSigner"
              @blur="touchField('form.preissuedAssetSigner')"
              id="asset-preissued-asset-signer"
              name="asset-create-preissued-asset-signer"
              :label="'asset-form.preissued-asset-signer-lbl' | globalize"
              :error-message="getFieldErrorMessage(
                'form.preissuedAssetSigner',
              )"
              :disabled="formMixin.isDisabled"
            />
            <button
              v-ripple
              type="button"
              class="app__button-flat issuance-form__insert-account-id-btn"
              @click="form.preissuedAssetSigner = accountId"
            >
              {{ 'asset-form.use-my-account-id-btn' | globalize }}
            </button>
          </div>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            type="number"
            v-model="form.initialPreissuedAmount"
            @blur="touchField('form.initialPreissuedAmount')"
            id="asset-initial-preissued-amount"
            name="asset-create-initial-preissued-amount"
            :label="'asset-form.initial-preissued-amount-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.initialPreissuedAmount',
              { from: MIN_AMOUNT, to: MAX_AMOUNT }
            )"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
    </template>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="form.terms"
          name="asset-create-terms"
          :note="'asset-form.terms-note' | globalize"
          accept=".jpg, .png, .pdf"
          :document-type="DOCUMENT_TYPES.assetTerms"
          :label="'asset-form.terms-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation() || submit()"
        @cancel="hideConfirmation"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="app__button-raised advanced-step-form__btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'asset-form.submit-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import config from '@/config'

import { requiredUnless, amountRange } from '@validators'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'advanced-step-form',
  mixins: [FormMixin],
  props: {
    request: { type: CreateAssetRequest, default: null },
  },

  data: _ => ({
    form: {
      isPreissuanceDisabled: false,
      preissuedAssetSigner: '',
      initialPreissuedAmount: '',
      terms: null,
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DOCUMENT_TYPES,
  }),

  validations () {
    return {
      form: {
        preissuedAssetSigner: {
          required: requiredUnless(function () {
            return this.form.isPreissuanceDisabled
          }),
        },
        initialPreissuedAmount: {
          required: requiredUnless(function () {
            return this.form.isPreissuanceDisabled
          }),
          amountRange: amountRange(
            this.MIN_AMOUNT,
            this.MAX_AMOUNT,
          ),
        },
      },
    }
  },

  created () {
    if (this.request) {
      this.populateForm()
    }
  },

  methods: {
    populateForm () {
      const isPreissuanceDisabled =
        this.request.preissuedAssetSigner === config.NULL_ASSET_SIGNER

      this.form = {
        isPreissuanceDisabled: isPreissuanceDisabled,
        preissuedAssetSigner: isPreissuanceDisabled
          ? ''
          : this.request.preissuedAssetSigner,
        initialPreissuedAmount: isPreissuanceDisabled
          ? ''
          : this.request.initialPreissuedAmount,
        terms: this.request.terms.key
          ? new DocumentContainer(this.request.terms)
          : null,
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

.advanced-step-form__btn {
  width: 14.4rem;
}

.advanced-step-form__kyc-required-row {
  margin-top: 2.1rem;
}

.issuance-form__pre-issued-asset-signer-wrp {
  display: flex;
  align-items: center;
}

.issuance-form__insert-account-id-btn {
  margin-left: .4rem;
}
</style>
