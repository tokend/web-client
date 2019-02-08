<template>
  <form class="app-form limits-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="selectedOpType"
          :values="formattedOpTypes"
          :form-free="true"
          :label="'limits-form.operation-type' | globalize"
          :key="`limits-asset-selector-${selectedOpType.value}`"
          class="limits__assets-select"
        />
      </div>
    </div>
    <div class="limits-form__table app__table">
      <table class="app__table">
        <thead>
          <tr>
            <th>
              {{ 'limits-form.to-lbl' | globalize }}
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
          id="transfer-description"
          name="description"
          type="number"
          v-model="form.dailyOut"
          :label="'limits-form.daily-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.dailyOut')"
          :error-message="getFieldErrorMessage(
            'form.dailyOut',
            { maxValue: config.MAX_AMOUNT, quantity: config.DECIMAL_POINTS }
          )"
        />
      </div>
      <div class="app__form-field">
        <input-field
          id="transfer-description"
          name="description"
          type="number"
          v-model="form.weeklyOut"
          :label="'limits-form.weekly-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.weeklyOut')"
          :error-message="getFieldErrorMessage(
            'form.weeklyOut',
            { maxValue: config.MAX_AMOUNT, quantity: config.DECIMAL_POINTS }
          )"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          id="transfer-description"
          name="description"
          type="number"
          v-model="form.monthlyOut"
          :label="'limits-form.monthly-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.monthlyOut')"
          :error-message="getFieldErrorMessage(
            'form.monthlyOut',
            { maxValue: config.MAX_AMOUNT, quantity: config.DECIMAL_POINTS }
          )"
        />
      </div>
      <div class="app__form-field">
        <input-field
          id="transfer-description"
          name="description"
          type="number"
          v-model="form.annualOut"
          :label="'limits-form.annual-limit-lbl' | globalize"
          :readonly="formMixin.isDisabled"
          @blur="touchField('form.annualOut')"
          :error-message="getFieldErrorMessage(
            'form.annualOut',
            { maxValue: config.MAX_AMOUNT, quantity: config.DECIMAL_POINTS }
          )"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <textarea-field
          id="transfer-description"
          name="description"
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
        v-if="!formMixin.isFormConfirmationShown"
        v-ripple
        type="button"
        class="app__button-raised"
        :disabled="formMixin.isDisabled"
        @click="tryToSubmit"
      >
        {{ 'limits-form.send-request-btn' | globalize }}
      </button>

      <form-confirmation
        v-if="formMixin.isFormConfirmationShown"
        :is-pending="formMixin.isDisabled"
        :message="'transfer-form.recheck-form' | globalize"
        :ok-button="'transfer-form.submit-btn' | globalize"
        @cancel="hideFormConfirmation"
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
  maxValueWrapper,
  decimal,
  maxDecimalPoints,
} from '@validators'
import { Bus } from '@/js/helpers/event-bus'
import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { base, STATS_OPERATION_TYPES } from '@tokend/js-sdk'
import config from '@/config'

const OPERATION_TYPES_TRANSLATION_ID = {
  [STATS_OPERATION_TYPES.deposit]: 'limits-form.op-type-deposit',
  [STATS_OPERATION_TYPES.withdraw]: 'limits-form.op-type-withdraw',
  [STATS_OPERATION_TYPES.paymentOut]: 'limits-form.op-type-payment-out',
}

const STATS_OPERATION_TYPES_KEY_NAMES = {
  [STATS_OPERATION_TYPES.deposit]: 'deposit',
  [STATS_OPERATION_TYPES.withdraw]: 'withdraw',
  [STATS_OPERATION_TYPES.paymentOut]: 'payment',
}

const EVENTS = {
  limitsChanged: 'limits-changed',
}

export default {
  name: 'limits-form',
  components: {
  },
  mixins: [FormMixin],
  props: {
    limits: { type: Object, required: true, default: () => ({}) },
  },
  data: () => ({
    form: {
      dailyOut: '',
      weeklyOut: '',
      monthlyOut: '',
      annualOut: '',
      note: '',
    },
    selectedOpType: {},
    opts: [],
    STATS_OPERATION_TYPES,
    OPERATION_TYPES_TRANSLATION_ID,
    STATS_OPERATION_TYPES_KEY_NAMES,
    formattedOpTypes: [],
    isLimitsChanged: false,
    formNoteMaxLength: 250,
    config,
  }),
  validations () {
    return {
      form: {
        dailyOut: {
          decimal,
          maxValueWrapper: maxValueWrapper(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
        },
        weeklyOut: {
          decimal,
          maxValueWrapper: maxValueWrapper(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
        },
        monthlyOut: {
          decimal,
          maxValueWrapper: maxValueWrapper(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
        },
        annualOut: {
          decimal,
          maxValueWrapper: maxValueWrapper(config.MAX_AMOUNT),
          maxDecimalPoints: maxDecimalPoints(config.DECIMAL_POINTS),
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
      return this.limits[STATS_OPERATION_TYPES_KEY_NAMES[this.selectedOpType.value]]
    },
  },
  created () {
    this.formatOpTypes()
    this.selectedOpType = this.formattedOpTypes[0]
  },
  methods: {
    tryToSubmit () {
      if (!this.isFormValid()) return
      this.showFormConfirmation()
    },
    async submit () {
      this.disableForm()
      try {
        await this.createRequest()

        Bus.success('limits-form.request-successfully-created')
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
      this.hideFormConfirmation()
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
      // eslint-disable-next-line
      const operationType = STATS_OPERATION_TYPES_KEY_NAMES[+this.selectedOpType.value]
      const statsOpType = +this.selectedOpType.value

      // eslint-disable-next-line
      const operation = base.CreateManageLimitsRequestBuilder.createManageLimitsRequest({
        requestID: '0',
        details: {
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
    formatOpTypes () {
      // eslint-disable-next-line
      for (const [key, value] of Object.entries(OPERATION_TYPES_TRANSLATION_ID)) {
        this.formattedOpTypes.push({
          value: key,
          label: value,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.limits-form__form-subheading {
  margin-top: 3.2rem;
  margin-bottom: -.8rem;
}
</style>
