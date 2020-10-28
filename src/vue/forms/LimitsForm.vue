<template>
  <form class="app-form limits-form">
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          name="limits-op-type"
          v-model="selectedOpType"
          :label="'limits-form.operation-type' | globalize"
          :key="`limits-asset-selector-${selectedOpType}`"
          @change="former.setAttr('statsOpType', selectedOpType)"
          class="limits__assets-select app__select-with-label--no-border"
        >
          <option
            v-for="type in FORMATTED_STATS_OPERATION_TYPES"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label | globalize }}
          </option>
        </select-field>
      </div>
    </div>
    <div class="limits-form__table app__table">
      <table class="app__table">
        <thead>
          <tr>
            <th>
              {{ 'limits-form.type-lbl' | globalize }}
            </th>
            <th>
              {{ 'limits-form.limit-lbl' | globalize }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ 'limits-form.daily-limit-lbl' | globalize }}</td>
            <td>
              {{
                getLimitByScope('dailyOut') ||
                  'limits-form.not-set-lbl' | globalize
              }}
            </td>
          </tr>
          <tr>
            <td>{{ 'limits-form.weekly-limit-lbl' | globalize }}</td>
            <!-- eslint-disable-next-line -->
            <td>
              {{
                getLimitByScope('weeklyOut') ||
                  'limits-form.not-set-lbl' | globalize
              }}
            </td>
          </tr>
          <tr>
            <td>{{ 'limits-form.monthly-limit-lbl' | globalize }}</td>
            <!-- eslint-disable-next-line -->
            <td>
              {{
                getLimitByScope('monthlyOut') ||
                  'limits-form.not-set-lbl' | globalize
              }}
            </td>
          </tr>
          <tr>
            <td>{{ 'limits-form.annual-limit-lbl' | globalize }}</td>
            <!-- eslint-disable-next-line -->
            <td>
              {{
                getLimitByScope('annualOut') ||
                  'limits-form.not-set-lbl' | globalize
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
        v-if="formMixin.isConfirmationShown"
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
import { LIMITS_REQUEST_TYPE } from '@/js/const/limits.const'
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

/**
 * This is an array with formatted actual STATS_OPERATION_TYPES that allows
 * <select-field> to work right.
*/
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
const MAX_VALID_LIMIT_VALUE = config.MAX_AMOUNT

export default {
  name: 'limits-form',
  mixins: [FormMixin],
  props: {
    limits: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data: () => ({
    form: {
      dailyOut: '',
      weeklyOut: '',
      monthlyOut: '',
      annualOut: '',
      note: '',
    },
    former: null,
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
    selectedLimitsByOpType () {
      // eslint-disable-next-line
      return this.limits[STATS_OPERATION_TYPES_KEY_NAMES[this.selectedOpType]]
    },
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
    selectedLimitsByOpType () {
      this.former = new LimitsFormer({
        dailyOut: this.selectedLimitsByOpType.dailyOut,
        weeklyOut: this.selectedLimitsByOpType.weeklyOut,
        monthlyOut: this.selectedLimitsByOpType.monthlyOut,
        annualOut: this.selectedLimitsByOpType.annualOut,
      })
      this.form.dailyOut = this.former.dailyOut || ''
      this.form.weeklyOut = this.former.weeklyOut || ''
      this.form.monthlyOut = this.former.monthlyOut || ''
      this.form.annualOut = this.former.annualOut || ''
    },
  },
  created () {
    this.selectedOpType = this.FORMATTED_STATS_OPERATION_TYPES[0].value
    this.former = new LimitsFormer({
      dailyOut: this.selectedLimitsByOpType.dailyOut,
      weeklyOut: this.selectedLimitsByOpType.weeklyOut,
      monthlyOut: this.selectedLimitsByOpType.monthlyOut,
      annualOut: this.selectedLimitsByOpType.annualOut,
    })
  },
  methods: {
    tryToSubmit () {
      if (!this.isFormValid()) return
      this.showConfirmation()
    },
    getLimitByScope (period) {
      const limitByType = this.selectedLimitsByOpType
      switch (period) {
        case 'dailyOut':
          if (limitByType.dailyOut === MAX_VALID_LIMIT_VALUE) {
            return ''
          }
          return limitByType.dailyOut
        case 'weeklyOut':
          if (limitByType.weeklyOut === MAX_VALID_LIMIT_VALUE) {
            return ''
          }
          return limitByType.weeklyOut
        case 'monthlyOut':
          if (limitByType.monthlyOut === MAX_VALID_LIMIT_VALUE) {
            return ''
          }
          return limitByType.monthlyOut
        case 'annualOut':
          if (limitByType.annualOut === MAX_VALID_LIMIT_VALUE) {
            return ''
          }
          return limitByType.annualOut
      }
    },
    async submit () {
      this.disableForm()
      this.isRequestCreating = true
      try {
        await this.createRequest()
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
      this.hideConfirmation()
      this.$emit(EVENTS.limitsChanged)
    },
    async createRequest () {
      this.former.setAttr('asset', this.selectedLimitsByOpType.assetCode)
      this.former.setAttr('requestType', LIMITS_REQUEST_TYPE.initial)
      const statsOpType = this.selectedOpType
      this.former.setAttr('statsOpType', +statsOpType)
      this.former.setAttr('operationType', STATS_OPERATION_TYPES_KEY_NAMES[+statsOpType])

      const [operation] = await this.former.buildOps()
      await api.postOperations(operation)
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

.limits__assets-select {
  min-width: 11rem;
}
</style>
