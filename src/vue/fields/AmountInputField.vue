<template>
  <div class="amount-input-field">
    <input-field
      v-bind="$attrs"
      name="transfer-amount"
      type="number"
      :value="value"
      v-on="listeners"
      autocomplete="off"
      :label="label"
      :min="min"
      :max="max"
      :step="minAmount"
      :error-message="getFieldErrorMessage('value', {
        from: minAmount,
        to: maxIncomingAmount
      })"
      @blur="touchField('value')"
    />

    <button
      v-if="isMaxButtonShown"
      class="amount-input-field__max-btn"
      type="button"
      @click="$emit(EVENTS.input, maxIncomingAmount)"
      :disabled="$attrs.disabled || $attrs.readonly"
    >
      <i class="mdi mdi-arrow-up-bold amount-input-field__max-icon" />
    </button>
  </div>
</template>

<script>
import InputField from '@/vue/fields/InputField'

import FormValidationMixin from '@/vue/mixins/form-validation.mixin'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { MathUtil } from '@/js/utils/math.util'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import config from '@/config'
import {
  required,
  amountRange,
  lessThenMax,
  moreThenMin,
} from '@validators'

const EVENTS = {
  input: 'input',
}
const AMOUNT_VALIDATION_TYPE = {
  incoming: 'incoming',
  outgoing: 'outgoing',
  issuance: 'issuance',
}

export default {
  name: 'asset-input-field',
  components: {
    InputField,
  },
  mixins: [FormValidationMixin],
  props: {
    asset: { type: AssetRecord, required: true },
    label: { type: String, default: '' },
    value: { type: [Number, String], default: undefined },
    validationType: { type: String, required: true },
    isMaxButtonShown: { type: Boolean, default: false },
    min: { type: [Number, String], default: config.MIN_AMOUNT },
    max: { type: [Number, String], default: config.MAX_AMOUNT },
  },
  data: _ => ({
    EVENTS,
  }),
  validations () {
    let validations = {
      value: {
        required,
      },
    }
    switch (this.validationType) {
      case AMOUNT_VALIDATION_TYPE.incoming:
        validations.value.amountRange = amountRange(
          this.minAmount,
          MathUtil.subtract(config.MAX_AMOUNT, this.balance)
        )
        break
      case AMOUNT_VALIDATION_TYPE.outgoing:
        validations.value.amountRange =
          amountRange(this.minAmount, this.balance)
        break
      case AMOUNT_VALIDATION_TYPE.issuance:
        validations.value.maxForIssuance =
          lessThenMax(+this.asset.availableForIssuance)
        validations.value.minForIssuance =
          moreThenMin(this.minAmount)
        break
    }
    return validations
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalanceByCode,
    ]),
    minAmount () {
      return this.asset.trailingDigitsCount
        ? Math.pow(10, (-1) * this.asset.trailingDigitsCount)
        : Math.pow(10, (-1) * config.DECIMAL_POINTS)
    },
    maxIncomingAmount () {
      let maxAvailableAmount

      switch (this.validationType) {
        case AMOUNT_VALIDATION_TYPE.incoming:
          maxAvailableAmount = MathUtil.subtract(
            config.MAX_AMOUNT, this.balance
          )
          break
        case AMOUNT_VALIDATION_TYPE.outgoing:
          maxAvailableAmount = this.balance
          break
        case AMOUNT_VALIDATION_TYPE.issuance:
          maxAvailableAmount = this.asset.availableForIssuance
          break
        default:
          maxAvailableAmount = config.MAX_AMOUNT
          break
      }

      return MathUtil.compare(this.max, maxAvailableAmount) >= 0
        ? maxAvailableAmount
        : this.max
    },
    balance () {
      return this.accountBalanceByCode(this.asset.code).balance || 0
    },
    listeners () {
      return {
        ...this.$listeners,
        input: event => {
          this.$emit(EVENTS.input, event)
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'scss/variables';

.amount-input-field {
  display: flex;
}

.amount-input-field__max-btn {
  margin-top: 1.4rem;
  margin-left: 0.6rem;
  max-width: 2.4rem;
  max-height: 2.4rem;
  color: $field-color-unfocused;
  transition: 0.2s color;

  &:disabled {
    filter: grayscale(100%);
    cursor: default;
  }

  &:enabled:hover,
  &:enabled:focus {
    color: inherit;
  }
}

.amount-input-field__max-icon {
  font-size: 2.4rem;
}
</style>
