<template>
  <form
    class="app__form advanced-step-form"
    @submit.prevent="isFormValid() && setConfirmationState()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.isPreissuanceDisabled"
          :disabled="isDisabled"
        >
          {{ 'create-asset-form.additional-issuance-check' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="!form.isPreissuanceDisabled">
      <div class="app__form-row">
        <div class="app__form-field">
          <div class="advanced-step-form__pre-issued-asset-signer-wrp">
            <input-field
              white-autofill
              v-model="form.preissuedAssetSigner"
              @blur="touchField('form.preissuedAssetSigner')"
              name="create-asset-preissued-asset-signer"
              :label="'create-asset-form.preissued-signer-lbl' | globalize"
              :error-message="getFieldErrorMessage(
                'form.preissuedAssetSigner',
              )"
              :disabled="isDisabled"
            />
            <button
              v-ripple
              type="button"
              class="app__button-flat advanced-step-form__insert-account-id-btn"
              :disabled="isDisabled"
              @click="form.preissuedAssetSigner = accountId"
            >
              {{ 'create-asset-form.use-my-account-id-btn' | globalize }}
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
            name="create-asset-initial-preissued-amount"
            :label="'create-asset-form.preissued-amount-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.initialPreissuedAmount',
              { from: MIN_AMOUNT, to: maxIssuanceAmount }
            )"
            :disabled="isDisabled"
          />
        </div>
      </div>
    </template>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="form.terms"
          name="create-asset-terms"
          :note="'create-asset-form.terms-note' | globalize"
          accept=".jpg, .png, .pdf"
          :document-type="DOCUMENT_TYPES.assetTerms"
          :label="'create-asset-form.terms-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation() || submit()"
        @cancel="hideConfirmation() || emitEnabledState()"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="app__button-raised advanced-step-form__btn"
        :disabled="isDisabled"
      >
        <template v-if="request">
          {{ 'create-asset-form.update-request-btn' | globalize }}
        </template>

        <template v-else>
          {{ 'create-asset-form.create-request-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import config from '../_config'

import { requiredUnless, amountRange } from '@validators'

const EVENTS = {
  submit: 'submit',
  updateIsDisabled: 'update:isDisabled',
}

export default {
  name: 'advanced-step-form',
  mixins: [FormMixin],
  props: {
    request: { type: CreateAssetRequest, default: null },
    isDisabled: { type: Boolean, default: false },
    accountId: { type: String, required: true },
    maxIssuanceAmount: { type: String, default: '0' },
  },

  data: _ => ({
    form: {
      isPreissuanceDisabled: false,
      preissuedAssetSigner: '',
      initialPreissuedAmount: '',
      terms: null,
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
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
            this.maxIssuanceAmount,
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
        terms: this.request.termsKey
          ? new DocumentContainer(this.request.terms)
          : null,
      }
    },

    submit () {
      if (this.isFormValid()) {
        this.$emit(EVENTS.submit, this.form)
      }
    },

    setConfirmationState () {
      this.showConfirmation()
      this.emitDisabledState()
    },

    emitDisabledState () {
      this.$emit(EVENTS.updateIsDisabled, true)
    },

    emitEnabledState () {
      this.$emit(EVENTS.updateIsDisabled, false)
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

.advanced-step-form__pre-issued-asset-signer-wrp {
  display: flex;
  align-items: center;
}

.advanced-step-form__insert-account-id-btn {
  margin-left: .4rem;
}
</style>
