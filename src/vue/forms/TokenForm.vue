<template>
  <form
    novalidate
    class="app__form token-form"
    @submit.prevent="submit"
  >
    <form-stepper
      :steps="STEPS"
      :current-step.sync="currentStep"
    >
      <template v-if="currentStep === STEPS.information.number">
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.information.name"
              @blur="touchField('form.information.name')"
              id="token-name"
              :label="'token-form.name-lbl' | globalize"
              :error-message="getErrorMessage(
                'form.information.name',
                null,
                STEPS.information
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.information.code"
              @blur="touchField('form.information.code')"
              id="token-code"
              :label="'token-form.code-lbl' | globalize"
              :error-message="getErrorMessage(
                'form.information.code',
                null,
                STEPS.information
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.information.maxIssuanceAmount"
              @blur="touchField('form.information.maxIssuanceAmount')"
              id="token-max-issuance-amount"
              :label="'token-form.max-issuance-amount-lbl' | globalize"
              :error-message="getErrorMessage(
                'form.information.maxIssuanceAmount',
                { from: MIN_AMOUNT, to: MAX_AMOUNT },
                STEPS.information
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <tick-field
              v-model="form.information.transferable"
              id="token-transferable"
              :disabled="formMixin.isDisabled"
            >
              {{ 'token-form.transferable-lbl' | globalize }}
            </tick-field>
          </div>
        </div>
        <div class="app__form-row token-form__kyc-required-row">
          <div class="app__form-field">
            <tick-field
              v-model="form.information.kycRequired"
              id="token-kyc-required"
              :disabled="formMixin.isDisabled"
            >
              {{ 'token-form.kyc-required-lbl' | globalize }}
            </tick-field>
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <file-field
              v-model="form.information.icon"
              :note="'token-form.icon-note' | globalize"
              accept=".jpg, .png"
              :document-type="DOCUMENT_TYPES.assetLogo"
              :label="'token-form.icon-lbl' | globalize"
              :disabled="formMixin.isDisabled"
              :error-message="getErrorMessage(
                'form.information.icon',
                null,
                STEPS.information
              )"
            />
          </div>
        </div>
        <div class="app__form-actions">
          <button
            v-ripple
            class="token-form__btn"
            :disabled="formMixin.isDisabled"
            @click.prevent="next('form.information')"
          >
            {{ 'token-form.next-btn' | globalize }}
          </button>
        </div>
      </template>
      <template v-if="currentStep === STEPS.terms.number">
        <div class="app__form-row">
          <div class="app__form-field">
            <file-field
              v-model="form.terms.terms"
              :note="'token-form.terms-note' | globalize"
              accept=".jpg, .png, .pdf"
              :document-type="DOCUMENT_TYPES.assetTerms"
              :label="'token-form.terms-lbl' | globalize"
              :disabled="formMixin.isDisabled"
              :error-message="getErrorMessage(
                'form.terms.terms',
                null,
                STEPS.terms
              )"
            />
          </div>
        </div>
        <div class="app__form-actions">
          <button
            v-ripple
            type="submit"
            class="token-form__btn"
            :disabled="formMixin.isDisabled"
            @click.prevent="submit"
          >
            {{ 'token-form.submit-btn' | globalize }}
          </button>
        </div>
      </template>
    </form-stepper>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import FormStepper from '@/vue/common/FormStepper'

import config from '@/config'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { required, amountRange, documentContainer } from '@validators'

const STEPS = {
  information: {
    number: 1,
    titleId: 'token-form.information-step',
  },
  terms: {
    number: 2,
    titleId: 'token-form.terms-step',
  },
}

export default {
  name: 'token-form',
  components: {
    FormStepper,
  },
  mixins: [FormMixin],
  data: _ => ({
    form: {
      information: {
        name: '',
        code: '',
        maxIssuanceAmount: '',
        icon: null,
        transferable: false,
        kycRequired: false,
      },
      terms: {
        terms: null,
      },
    },
    currentStep: 1,
    STEPS,
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DOCUMENT_TYPES,
  }),
  validations () {
    return {
      form: {
        information: {
          name: { required },
          code: { required },
          maxIssuanceAmount: {
            required,
            amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
          },
          icon: { documentContainer },
        },
        terms: {
          terms: { documentContainer },
        },
      },
    }
  },
  methods: {
    next (formStep) {
      if (this.isFormValid(formStep)) {
        this.currentStep++
      }
    },
    getErrorMessage (field, opts, step) {
      if (this.currentStep === step.number) {
        return this.getFieldErrorMessage(field, opts)
      } else {
        return ''
      }
    },
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      alert('Submitting here')
      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.token-form__btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 14.4rem;
}

.token-form {
  .token-form__kyc-required-row {
    margin-top: 2.1rem;
  }
}
</style>
