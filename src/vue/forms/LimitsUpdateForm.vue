<template>
  <form class="app-form limits-update-form">
    <h3 class="limits-form__form-subheading app__form-subheading">
      {{ 'limits-form.request-new-limits' | globalize }}
    </h3>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          name="limit-daily-out"
          v-model="form.dailyOut"
          type="number"
          :min="minValidDailyOutValue"
          :max="config.MAX_AMOUNT"
          @change="former.setAttr('dailyOut', form.dailyOut)"
          :label="'limits-form.daily-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.dailyOut')"
          :error-message="getFieldErrorMessage(
            'form.dailyOut',
            {
              maxValue: config.MAX_AMOUNT,
              minValue: minValidDailyOutValue,
              quantity: config.DECIMAL_POINTS,
            }
          )"
        />
      </div>
      <div class="app__form-field">
        <input-field
          name="limit-weekly-out"
          v-model="form.weeklyOut"
          type="number"
          :min="minValidWeeklyOutValue"
          :max="config.MAX_AMOUNT"
          @change="former.setAttr('weeklyOut', form.weeklyOut)"
          :label="'limits-form.weekly-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.weeklyOut')"
          :error-message="getFieldErrorMessage(
            'form.weeklyOut',
            {
              maxValue: config.MAX_AMOUNT,
              minValue: minValidWeeklyOutValue,
              quantity: config.DECIMAL_POINTS,
            }
          )"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          name="limit-monthly-out"
          v-model="form.monthlyOut"
          type="number"
          :min="minValidMonthlyOutValue"
          :max="config.MAX_AMOUNT"
          @change="former.setAttr('monthlyOut', form.monthlyOut)"
          :label="'limits-form.monthly-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.monthlyOut')"
          :error-message="getFieldErrorMessage(
            'form.monthlyOut',
            {
              maxValue: config.MAX_AMOUNT,
              minValue: minValidMonthlyOutValue,
              quantity: config.DECIMAL_POINTS,
            }
          )"
        />
      </div>
      <div class="app__form-field">
        <input-field
          name="limit-annual-out"
          v-model="form.annualOut"
          type="number"
          :min="minValidAnnualOutValue"
          :max="config.MAX_AMOUNT"
          @change="former.setAttr('annualOut', form.annualOut)"
          :label="'limits-form.annual-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.annualOut')"
          :error-message="getFieldErrorMessage(
            'form.annualOut',
            {
              maxValue: config.MAX_AMOUNT,
              minValue: minValidAnnualOutValue,
              quantity: config.DECIMAL_POINTS,
            }
          )"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <textarea-field
          name="limit-note"
          v-model="form.note"
          :label="'limits-form.note-lbl' | globalize"
          :maxlength="formNoteMaxLength"
          :readonly="formMixin.isDisabled"
          @input="former.setAttr('note', form.note)"
          @blur="touchField('form.note')"
          :error-message="getFieldErrorMessage('form.note')"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button
        v-if="!formMixin.isConfirmationShown"
        v-ripple
        type="button"
        class="app__button-raised"
        :disabled="formMixin.isDisabled"
        @click="tryToSubmit"
      >
        {{ 'limits-form.send-request-btn' | globalize }}
      </button>

      <form-confirmation
        v-else
        :is-pending="isRequestCreating"
        :message="'transfer-form.recheck-form' | globalize"
        :ok-button="'transfer-form.submit-btn' | globalize"
        @cancel="hideConfirmation"
        @ok="submit"
      />
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import {
  maxLength,
  maxValue,
  decimal,
  minValue,
  maxDecimalPoints,
  required,
} from '@validators'
import { Bus } from '@/js/helpers/event-bus'
import { LimitsFormer } from '@/js/formers/LimitsFormer'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { errors, STATS_OPERATION_TYPES } from '@tokend/js-sdk'
import { OPERATION_ERROR_CODES } from '@/js/const/operation-error-codes.const'
import config from '@/config'

const STATS_OPERATION_TYPES_KEY_NAMES = {
  [STATS_OPERATION_TYPES.deposit]: 'deposit',
  [STATS_OPERATION_TYPES.withdraw]: 'withdraw',
  [STATS_OPERATION_TYPES.paymentOut]: 'payment',
}

const FORMATTED_STATS_OPERATION_TYPES = [
  {
    value: STATS_OPERATION_TYPES.deposit,
    label: 'limits-form.op-type-deposit',
  },
  {
    value: STATS_OPERATION_TYPES.withdraw,
    label: 'limits-form.op-type-withdraw',
  },
  {
    value: STATS_OPERATION_TYPES.paymentOut,
    label: 'limits-form.op-type-payment-out',
  },
]

const EVENTS = {
  limitsChanged: 'limits-changed',
}

const MIN_VALID_LIMIT_VALUE = 0

export default {
  name: 'limits-update-form',
  mixins: [FormMixin],
  props: {
    former: { type: LimitsFormer, required: true },
  },
  data: () => ({
    form: {
      dailyOut: '',
      weeklyOut: '',
      monthlyOut: '',
      annualOut: '',
      note: '',
    },
    selectedOpType: '',
    isRequestCreating: false,
    formNoteMaxLength: 250,
    FORMATTED_STATS_OPERATION_TYPES,
    STATS_OPERATION_TYPES_KEY_NAMES,
    config,
  }),
  validations () {
    return {
      form: {
        dailyOut: {
          decimal,
          maxValue: maxValue(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
          minValue: minValue(this.minValidDailyOutValue),
          required,
        },
        weeklyOut: {
          decimal,
          maxValue: maxValue(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
          minValue: minValue(this.minValidWeeklyOutValue),
          required,
        },
        monthlyOut: {
          decimal,
          maxValue: maxValue(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
          minValue: minValue(this.minValidMonthlyOutValue),
          required,
        },
        annualOut: {
          decimal,
          maxValue: maxValue(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
          minValue: minValue(this.minValidAnnualOutValue),
          required,
        },
        note: {
          maxLength: maxLength(this.formNoteMaxLength),
        },
      },
    }
  },
  computed: {
    minValidDailyOutValue () {
      return MIN_VALID_LIMIT_VALUE
    },
    minValidWeeklyOutValue () {
      return Math.max(
        MIN_VALID_LIMIT_VALUE,
        +this.form.dailyOut,
      )
    },
    minValidMonthlyOutValue () {
      return Math.max(
        MIN_VALID_LIMIT_VALUE,
        +this.form.dailyOut,
        +this.form.weeklyOut,
      )
    },
    minValidAnnualOutValue () {
      return Math.max(
        MIN_VALID_LIMIT_VALUE,
        +this.form.dailyOut,
        +this.form.weeklyOut,
        +this.form.monthlyOut,
      )
    },
  },
  watch: {
    former () {
      this.form.dailyOut = this.former.attrs.dailyOut || ''
      this.form.weeklyOut = this.former.attrs.weeklyOut || ''
      this.form.monthlyOut = this.former.attrs.monthlyOut || ''
      this.form.annualOut = this.former.attrs.annualOut || ''
    },
  },
  methods: {
    tryToSubmit () {
      if (!this.isFormValid()) return
      this.showConfirmation()
    },

    async submit () {
      this.disableForm()
      this.isRequestCreating = true
      try {
        const operation = await this.former.buildOps()
        await api.postOperations(operation)
        Bus.success('limits-form.request-successfully-created')
      } catch (error) {
        if (
          error instanceof errors.TransactionError &&
          error.includesOpCode(OPERATION_ERROR_CODES
            .opManageLimitsRequestReferenceDuplication)
        ) {
          Bus.error('limits-form.error-duplicate-request')
        } else {
          ErrorHandler.process(error)
        }
      }
      this.isRequestCreating = false
      this.enableForm()
      this.$emit(EVENTS.limitsChanged)
      this.hideConfirmation()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.limits-form__form-subheading {
  margin-top: 3.2rem;
  margin-bottom: -0.8rem;
}

</style>
