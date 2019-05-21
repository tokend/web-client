<template>
  <form
    novalidate
    class="app__form create-issuance-form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="form.asset"
          :values="ownedAssets"
          name="create-issuance-asset"
          key-as-value-text="nameAndCode"
          :label="'issuance-form.asset-lbl' | globalize"
          @blur="touchField('form.asset')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <div class="create-issuance-form__amount-wrapper">
          <input-field
            white-autofill
            type="number"
            v-model="form.amount"
            @blur="touchField('form.amount')"
            name="create-issuance-amount"
            :label="'issuance-form.amount-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.amount',
              {
                from: MIN_AMOUNT,
                to: form.asset.availableForIssuance,
                maxDecimalDigitsCount: DECIMAL_POINTS
              }
            )"
            :disabled="formMixin.isDisabled"
          />

          <p
            v-if="form.asset.code"
            class="create-issuance-form__issuance-asset-code"
          >
            {{ form.asset.code }}
          </p>
        </div>

        <p
          v-if="form.asset.availableForIssuance"
          class="app__form-field-description"
        >
          {{
            'issuance-form.available-for-issuance-hint' | globalize({
              amount: {
                value: form.asset.availableForIssuance,
                currency: form.asset.code
              }
            })
          }}
        </p>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.receiver"
          @blur="touchField('form.receiver')"
          name="create-issuance-receiver"
          :label="'issuance-form.receiver-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.receiver')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.reference"
          @blur="touchField('form.reference')"
          name="create-issuance-reference"
          :error-message="getFieldErrorMessage(
            'form.reference',
            { length: REFERENCE_MAX_LENGTH }
          )"
          :label="'issuance-form.reference-lbl' | globalize"
          :maxlength="REFERENCE_MAX_LENGTH"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        :is-pending="isFormSubmitting"
        @ok="submit"
        @cancel="hideConfirmation"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="create-issuance-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{ 'issuance-form.issue-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import ManageIssuanceMixin from '../mixins/manage-issuance.mixin'

import config from '@/config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import {
  required,
  amountRange,
  emailOrAccountId,
  maxLength,
  maxDecimalDigitsCount,
} from '@validators'

const REFERENCE_MAX_LENGTH = 255
const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'create-issuance-form',
  mixins: [FormMixin, ManageIssuanceMixin],

  props: {
    ownedAssets: { type: Array, required: true },
  },

  data: _ => ({
    form: {
      asset: {},
      amount: '0',
      receiver: '',
      reference: '',
    },
    isFormSubmitting: false,
    MIN_AMOUNT: config.MIN_AMOUNT,
    DECIMAL_POINTS: config.DECIMAL_POINTS,
    REFERENCE_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
          amountRange: amountRange(
            config.MIN_AMOUNT,
            this.form.asset.availableForIssuance
          ),
          maxDecimalDigitsCount: maxDecimalDigitsCount(config.DECIMAL_POINTS),
        },
        receiver: { required, emailOrAccountId },
        reference: {
          required,
          maxLength: maxLength(REFERENCE_MAX_LENGTH),
        },
      },
    }
  },

  async created () {
    this.form.asset = this.ownedAssets[0]
  },

  methods: {
    async submit () {
      this.isFormSubmitting = true
      try {
        await this.createIssuance()
        Bus.success('issuance-form.assets-issued-msg')
        this.$emit(EVENTS.submit)
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.isFormSubmitting = false
      this.hideConfirmation()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.create-issuance-form__submit-btn {
  max-width: 18rem;
  width: 100%;
}

.create-issuance-form__amount-wrapper {
  display: flex;
}

.create-issuance-form__issuance-asset-code {
  margin-left: 1rem;
  padding-top: 1.8rem;
  font-size: 1.8rem;
}
</style>
