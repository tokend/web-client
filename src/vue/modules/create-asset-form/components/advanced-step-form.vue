<template>
  <form
    class="app__form advanced-step-form"
    @submit.prevent="isFormValid() && setConfirmationState()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          class="advanced-step-form__pre-issuance-enablement-tick-field"
          v-model="form.isPreissuanceDisabled"
          :disabled="isDisabled"
        >
          {{ 'create-asset-form.additional-issuance-check' | globalize }}
        </tick-field>
        <router-link
          class="advanced-step-form__pre-issuance-guide-link"
          :to="vueRoutes.preIssuanceGuide"
          target="_blank"
        >
          {{ 'create-asset-form.pre-issuance-guide-link' | globalize }}
          <i
            class="mdi mdi-launch
            advanced-step-form__pre-issuance-guide-link-launch-icon"
          />
        </router-link>
      </div>
    </div>

    <template v-if="!form.isPreissuanceDisabled">
      <div class="app__form-row">
        <div class="app__form-field">
          <div class="advanced-step-form__pre-issued-asset-signer-wrp">
            <input-field
              white-autofill
              v-model="form.preIssuanceAssetSigner"
              @blur="touchField('form.preIssuanceAssetSigner')"
              name="create-asset-pre-issuance-asset-signer"
              :label="'create-asset-form.pre-issuance-signer-lbl' | globalize"
              :error-message="getFieldErrorMessage(
                'form.preIssuanceAssetSigner',
              )"
              :disabled="isDisabled"
            />
            <button
              v-ripple
              type="button"
              class="app__button-flat advanced-step-form__insert-account-id-btn"
              :disabled="isDisabled"
              @click="form.preIssuanceAssetSigner = mainSignerAccountId"
            >
              {{ 'create-asset-form.use-my-account-id-btn' | globalize }}
            </button>
          </div>

          <vue-markdown
            v-if="form.preIssuanceAssetSigner === mainSignerAccountId"
            class="advanced-step-form__pre-issuance-disclaimer"
            :source="'create-asset-form.pre-issuance-disclaimer' | globalize"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            type="number"
            :min="0"
            :max="maxIssuanceAmount"
            :step="MIN_AMOUNT"
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
          :file-extensions="['jpg', 'png', 'pdf']"
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

import VueMarkdown from 'vue-markdown'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import config from '@/config'

import { requiredUnless, amountRange } from '@validators'
import { vueRoutes } from '@/vue-router/routes'

const EVENTS = {
  submit: 'submit',
  updateIsDisabled: 'update:isDisabled',
}

export default {
  name: 'advanced-step-form',
  components: { VueMarkdown },
  mixins: [FormMixin],
  props: {
    request: { type: CreateAssetRequest, default: null },
    isDisabled: { type: Boolean, default: false },
    mainSignerAccountId: { type: String, required: true },
    maxIssuanceAmount: { type: String, default: '0' },
  },

  data: _ => ({
    form: {
      isPreissuanceDisabled: false,
      preIssuanceAssetSigner: '',
      initialPreissuedAmount: '',
      terms: null,
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
    DOCUMENT_TYPES,
    vueRoutes,
  }),

  validations () {
    return {
      form: {
        preIssuanceAssetSigner: {
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
        this.request.preIssuanceAssetSigner === config.NULL_ASSET_SIGNER

      this.form = {
        isPreissuanceDisabled: isPreissuanceDisabled,
        preIssuanceAssetSigner: isPreissuanceDisabled
          ? ''
          : this.request.preIssuanceAssetSigner,
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
@import '~@scss/variables';

.advanced-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.advanced-step-form__pre-issued-asset-signer-wrp {
  display: flex;
  align-items: center;
}

.advanced-step-form__insert-account-id-btn {
  margin-left: 0.4rem;
}

.advanced-step-form__pre-issuance-disclaimer {
  font-size: 1.4rem;
  margin-top: 1rem;
}

.advanced-step-form__pre-issuance-enablement-tick-field {
  margin-bottom: 1rem;
}

.advanced-step-form__pre-issuance-guide-link {
  text-decoration: none;
  border-bottom: 0.1rem solid $col-link;

  &:visited {
    color: $col-primary;
  }
}

.advanced-step-form__pre-issuance-guide-link-launch-icon {
  font-size: 1.4rem;
}
</style>
