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
      :min="minAmount"
      :max="maxAmount"
      :step="step"
      :error-message="getFieldErrorMessage('value', {
        min: {
          value: minAmount,
          currency: assetRecord.code,
        },
        max: {
          value: maxAmount,
          currency: assetRecord.code,
        },
      })"
      @blur="touchField('value')"
    />

    <button
      v-if="isMaxButtonShown"
      class="amount-input-field__max-btn"
      type="button"
      @click="$emit(EVENTS.input, maxAmount)"
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
import { required, amountRange } from '@validators'
import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  input: 'input',
}
const AMOUNT_VALIDATION_TYPE = {
  incoming: 'incoming',
  outgoing: 'outgoing',
  issuance: 'issuance',
  atomicSwap: 'atomicSwap',
}

export default {
  name: 'asset-input-field',

  components: {
    InputField,
  },

  mixins: [FormValidationMixin],

  props: {
    asset: { type: [AssetRecord, String], required: true },
    label: { type: String, default: '' },
    value: { type: [Number, String], default: undefined },
    validationType: { type: String, default: '' },
    isMaxButtonShown: { type: Boolean, default: false },
    min: { type: [Number, String], default: '' },
    max: { type: [Number, String], default: config.MAX_AMOUNT },
  },
  data: _ => ({
    EVENTS,
  }),

  validations () {
    return {
      value: {
        required,
        amountRange: amountRange(this.minAmount, this.maxAmount),
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
      vuexTypes.accountBalanceByCode,
    ]),

    assetRecord () {
      let result

      if (typeof this.asset === 'string') {
        result = this.assetByCode(this.asset)
      } else if (this.asset instanceof AssetRecord) {
        result = this.asset
      }

      return result || new AssetRecord()
    },

    step () {
      return this.assetRecord.trailingDigitsCount
        ? inputStepByDigitsCount(this.assetRecord.trailingDigitsCount)
        : inputStepByDigitsCount(config.DECIMAL_POINTS)
    },

    minAmount () {
      return this.min || this.step
    },

    maxAmount () {
      let result

      switch (this.validationType) {
        case AMOUNT_VALIDATION_TYPE.outgoing:
          result = this.balance
          break
        case AMOUNT_VALIDATION_TYPE.incoming:
        case AMOUNT_VALIDATION_TYPE.issuance:
          result = this.assetRecord.availableForIssuance
          break
        case AMOUNT_VALIDATION_TYPE.atomicSwap:
          result = MathUtil.add(
            this.assetRecord.availableForIssuance, this.balance
          )
          break

        default:
          result = config.MAX_AMOUNT
          break
      }

      return MathUtil.compare(this.max, result) >= 0
        ? result
        : this.max
    },

    balance () {
      return this.accountBalanceByCode(this.assetRecord.code).balance || 0
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
  created () {
    if (this.min && this.min < this.step) {
      ErrorHandler.processWithoutFeedback(
        new Error('Min value cannot be less than step'))
    }
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
    color: $col-field-icon;
  }
}

.amount-input-field__max-icon {
  font-size: 2.4rem;
}
</style>
