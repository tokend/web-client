<template>
  <form class="app-form limits-form">
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          name="limits-op-type"
          v-model="selectedOpType"
          :label="'limits-form.operation-type' | globalize"
          :key="`limits-asset-selector-${selectedOpType}`"
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
} from '@validators'
import { Bus } from '@/js/helpers/event-bus'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { base, errors, STATS_OPERATION_TYPES } from '@tokend/js-sdk'
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
    selectedOpType: '',
    opts: [],
    FORMATTED_STATS_OPERATION_TYPES,
    STATS_OPERATION_TYPES_KEY_NAMES,
    formattedOpTypes: [],
    isLimitsChanged: false,
    isRequestCreating: false,
    formNoteMaxLength: 250,
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
        },
        weeklyOut: {
          decimal,
          maxValue: maxValue(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
          minValue: minValue(this.minValidWeeklyOutValue),
        },
        monthlyOut: {
          decimal,
          maxValue: maxValue(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
          minValue: minValue(this.minValidMonthlyOutValue),
        },
        annualOut: {
          decimal,
          maxValue: maxValue(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
          minValue: minValue(this.minValidAnnualOutValue),
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
      this.form.dailyOut = this.selectedLimitsByOpType.dailyOut || ''
      this.form.weeklyOut = this.selectedLimitsByOpType.weeklyOut || ''
      this.form.monthlyOut = this.selectedLimitsByOpType.monthlyOut || ''
      this.form.annualOut = this.selectedLimitsByOpType.annualOut || ''
    },
  },
  created () {
    this.selectedOpType = this.FORMATTED_STATS_OPERATION_TYPES[0].value
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
          // eslint-disable-next-line
          error.includesOpCode(OPERATION_ERROR_CODES.opManageLimitsRequestReferenceDuplication)
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
      const asset = this.selectedLimitsByOpType.assetCode
      const limits = {
        annualOut: this.form.annualOut,
        dailyOut: this.form.dailyOut,
        monthlyOut: this.form.monthlyOut,
        weeklyOut: this.form.weeklyOut,
      }
      const note = this.form.note
      const requestType = LIMITS_REQUEST_TYPE.initial
      const statsOpType = +this.selectedOpType
      const operationType = STATS_OPERATION_TYPES_KEY_NAMES[statsOpType]

      const operation = base
        .CreateManageLimitsRequestBuilder
        .createManageLimitsRequest({
          requestID: '0',
          creatorDetails: {
            operationType,
            statsOpType,
            asset,
            limits,
            requestType,
            note,
          },
        })
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
