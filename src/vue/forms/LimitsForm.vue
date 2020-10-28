<template>
  <div class="app-form limits-form">
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
    <limits-update-form />
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { LIMITS_REQUEST_TYPE } from '@/js/const/limits.const'
// import {
//   maxLength,
//   maxValue,
//   decimal,
//   minValue,
//   maxDecimalPoints,
//   required,
// } from '@validators'
import { Bus } from '@/js/helpers/event-bus'
import { LimitsFormer } from '@/js/formers/LimitsFormer'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { errors, STATS_OPERATION_TYPES } from '@tokend/js-sdk'
import { OPERATION_ERROR_CODES } from '@/js/const/operation-error-codes.const'
import config from '@/config'
import { LimitsUpdateForm } from '../forms/LimitsUpdateForm.vue'

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

// const MIN_VALID_LIMIT_VALUE = 0
const MAX_VALID_LIMIT_VALUE = config.MAX_AMOUNT

export default {
  name: 'limits-form',
  components: {
    LimitsUpdateForm,
  },
  mixins: [FormMixin],
  props: {
    limits: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data: () => ({
    // form: {
    //   dailyOut: '',
    //   weeklyOut: '',
    //   monthlyOut: '',
    //   annualOut: '',
    //   note: '',
    // },
    former: null,
    selectedOpType: '',
    isRequestCreating: false,
    formNoteMaxLength: 250,
    FORMATTED_STATS_OPERATION_TYPES,
    STATS_OPERATION_TYPES_KEY_NAMES,
    config,
  }),
  computed: {
    selectedLimitsByOpType () {
      // eslint-disable-next-line
      return this.limits[STATS_OPERATION_TYPES_KEY_NAMES[this.selectedOpType]]
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
  // created () {
  //   this.selectedOpType = this.FORMATTED_STATS_OPERATION_TYPES[0].value
  //   this.former = new LimitsFormer({
  //     dailyOut: this.selectedLimitsByOpType.dailyOut,
  //     weeklyOut: this.selectedLimitsByOpType.weeklyOut,
  //     monthlyOut: this.selectedLimitsByOpType.monthlyOut,
  //     annualOut: this.selectedLimitsByOpType.annualOut,
  //   })
  // },
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

.limits__assets-select {
  min-width: 11rem;
}
</style>
