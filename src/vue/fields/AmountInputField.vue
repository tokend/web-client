<template>
  <div>
    <input-field
      name="transfer-amount"
      type="number"
      :value="value"
      v-on="listeners"
      autocomplete="off"
      :label="label"
      :step="minAmount"
      :error-message="getFieldErrorMessage('value', {
        from: minAmount,
        to: maxIncomingAmount
      })"
      :disabled="disabled"
      @blur="touchField('value')"
    />
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
    disabled: { type: Boolean, default: false },
    value: { type: [Number, String], default: undefined },
    validationType: { type: String, required: true },
  },
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
      switch (this.validationType) {
        case AMOUNT_VALIDATION_TYPE.incoming:
          return MathUtil.subtract(config.MAX_AMOUNT, this.balance)
        case AMOUNT_VALIDATION_TYPE.outgoing:
          return this.balance
        case AMOUNT_VALIDATION_TYPE.issuance:
          return this.asset.availableForIssuance
        default:
          return config.MAX_AMOUNT
      }
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
