<template>
  <form class="app-form limits-form">
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          name="limits-op-type"
          v-model="selectedOpType"
          :values="FORMATTED_STATS_OPERATION_TYPES"
          key-as-value-text="label"
          :is-value-translatable="true"
          :label="'limits-form.operation-type' | globalize"
          :key="`limits-asset-selector-${selectedOpType.value}`"
          class="limits__assets-select app__select--no-border"
        />
        <select-field
          name="limits-asset"
          v-model="asset"
          :values="assets"
          key-as-value-text="label"
          :is-value-translatable="true"
          :label="'limits-form.asset-lbl' | globalize"
          class="limits__assets-select app__select--no-border limits__assets"
        />
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
            <!-- eslint-disable-next-line -->
            <td>{{ selectedLimitsByOpType.dailyOut || 'limits-form.not-set-lbl' | globalize }}</td>
          </tr>
          <tr>
            <td>{{ 'limits-form.weekly-limit-lbl' | globalize }}</td>
            <!-- eslint-disable-next-line -->
            <td>{{ selectedLimitsByOpType.weeklyOut || 'limits-form.not-set-lbl' | globalize }}</td>
          </tr>
          <tr>
            <td>{{ 'limits-form.monthly-limit-lbl' | globalize }}</td>
            <!-- eslint-disable-next-line -->
            <td>{{ selectedLimitsByOpType.monthlyOut || 'limits-form.not-set-lbl' | globalize }}</td>
          </tr>
          <tr>
            <td>{{ 'limits-form.annual-limit-lbl' | globalize }}</td>
            <!-- eslint-disable-next-line -->
            <td>{{ selectedLimitsByOpType.annualOut || 'limits-form.not-set-lbl' | globalize }}</td>
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
          :label="'limits-form.daily-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.dailyOut')"
          type="number"
          :step="inputStepByDigitsCount"
          :error-message="getFieldErrorMessage(
            'form.dailyOut',
            {
              maxValue: config.MAX_AMOUNT,
              minValue: minValidDailyOutValue,
              quantity: trailingDigitsCount,
            }
          )"
        />
      </div>
      <div class="app__form-field">
        <input-field
          name="limit-weekly-out"
          v-model="form.weeklyOut"
          :label="'limits-form.weekly-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.weeklyOut')"
          type="number"
          :step="inputStepByDigitsCount"
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
          :label="'limits-form.monthly-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.monthlyOut')"
          type="number"
          :step="inputStepByDigitsCount"
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
          :label="'limits-form.annual-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.annualOut')"
          type="number"
          :step="inputStepByDigitsCount"
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
import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { base, errors, STATS_OPERATION_TYPES } from '@tokend/js-sdk'
import { OPERATION_ERROR_CODES } from '@/js/const/operation-error-codes.const'
import {
  inputStepByDigitsCount,
} from '@/js/helpers/input-trailing-digits-count'
import config from '@/config'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

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
    value: [STATS_OPERATION_TYPES.withdraw],
    label: 'limits-form.op-type-withdraw',
  },
  {
    value: [STATS_OPERATION_TYPES.paymentOut],
    label: 'limits-form.op-type-payment-out',
  },
]

const EVENTS = {
  limitsChanged: 'limits-changed',
}

const MIN_VALID_LIMIT_VALUE = 0

export default {
  name: 'limits-form',
  mixins: [FormMixin],
  props: {
    limits: { type: Object, default: () => ({}) },
  },
  data: () => ({
    form: {
      dailyOut: '',
      weeklyOut: '',
      monthlyOut: '',
      annualOut: '',
      note: '',
    },
    asset: null,
    selectedOpType: {},
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
          maxDecimalPoints: maxDecimalPoints(this.trailingDigitsCount),
          minValue: minValue(this.minValidDailyOutValue),
        },
        weeklyOut: {
          decimal,
          maxValue: maxValue(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(this.trailingDigitsCount),
          minValue: minValue(this.minValidWeeklyOutValue),
        },
        monthlyOut: {
          decimal,
          maxValue: maxValue(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(this.trailingDigitsCount),
          minValue: minValue(this.minValidMonthlyOutValue),
        },
        annualOut: {
          decimal,
          maxValue: maxValue(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(this.trailingDigitsCount),
          minValue: minValue(this.minValidAnnualOutValue),
        },
        note: {
          maxLength: maxLength(this.formNoteMaxLength),
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
    ]),
    selectedLimitsByOpType () {
      // eslint-disable-next-line
      return this.limits[STATS_OPERATION_TYPES_KEY_NAMES[this.selectedOpType.value]]
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
    assetsDetails () {
      return this.accountBalances.map(asset => asset.assetDetails)
    },
    assets () {
      return this.assetsDetails.map(asset => asset.code)
    },
    trailingDigitsCount () {
      return this.assetsDetails
        .find(asset => asset.code === this.asset)
        .trailingDigitsCount || config.MIN_AMOUNT
    },
    inputStepByDigitsCount () {
      return inputStepByDigitsCount(
        this.trailingDigitsCount
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
    this.selectedOpType = this.FORMATTED_STATS_OPERATION_TYPES[0]
    this.asset = this.selectedLimitsByOpType.assetCode
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
      const asset = this.asset
      const limits = {
        annualOut: this.form.annualOut,
        dailyOut: this.form.dailyOut,
        monthlyOut: this.form.monthlyOut,
        weeklyOut: this.form.weeklyOut,
      }
      const note = this.form.note
      const requestType = LIMITS_REQUEST_TYPE.initial
      const statsOpType = +this.selectedOpType.value
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
      await Sdk.horizon.transactions.submitOperations(operation)
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.limits__assets {
  margin-left: 3rem;
}

.limits-form__form-subheading {
  margin-top: 3.2rem;
  margin-bottom: -0.8rem;
}

.limits__assets-select {
  min-width: 11rem;
}
</style>
