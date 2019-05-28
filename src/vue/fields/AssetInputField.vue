<template>
  <div>
    <input-field
      name="transfer-amount"
      type="number"
      :value="value"
      v-on="listeners"
      autocomplete="off"
      :label="label"
      :step="minimalNumberInputStep"
      :error-message="getFieldErrorMessage('value', {
        from: minimalNumberInputStep,
        to: maxIncomingAmount
      })"
      @blur="touchField('value')"
    />
  </div>
</template>

<script>
import InputField from '@/vue/fields/InputField'

import FieldMixin from '@/vue/mixins/field.mixin'
import { AssetRecord } from '@/js/records/entities/asset.record'
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
const INPUT_FIELD_TYPE = {
  incoming: 'incoming',
  outgoing: 'outgoing',
  issuance: 'issuance',
}

export default {
  name: 'asset-input-field',
  components: {
    InputField,
  },
  mixins: [FieldMixin],
  props: {
    asset: { type: AssetRecord, required: true },
    label: { type: String, default: '' },
    value: { type: [Number, String], default: undefined },
    inputFieldType: { type: String, default: INPUT_FIELD_TYPE.issuance },
  },
  data () {
    return {}
  },
  validations () {
    let validations = {
      value: {
        required,
      },
    }
    switch (this.inputFieldType) {
      case INPUT_FIELD_TYPE.incoming:
        validations.value.amountRange = amountRange(
          this.minimalNumberInputStep,
          (config.MAX_AMOUNT - this.balance)
        )
        break
      case INPUT_FIELD_TYPE.outgoing:
        validations.value.amountRange =
          amountRange(this.minimalNumberInputStep, this.balance)
        break
      case INPUT_FIELD_TYPE.issuance:
        validations.value.maxForIssuance =
          lessThenMax(+this.asset.availableForIssuance)
        validations.value.minForIssuance =
          moreThenMin(this.minimalNumberInputStep)
        break
    }
    return validations
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
    ]),
    minimalNumberInputStep () {
      return this.asset.trailingDigitsCount
        ? Math.pow(10, (-1) * this.asset.trailingDigitsCount)
        : Math.pow(10, (-1) * config.DECIMAL_POINTS)
    },
    maxIncomingAmount () {
      switch (this.inputFieldType) {
        case INPUT_FIELD_TYPE.incoming:
          return config.MAX_AMOUNT - this.balance
        case INPUT_FIELD_TYPE.outgoing:
          return this.balance
        case INPUT_FIELD_TYPE.issuance:
          return +this.asset.availableForIssuance
        default:
          return config.MAX_AMOUNT
      }
    },
    balance () {
      return this.accountBalances
        .find(i => i.asset === this.asset.code).balance || 0
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
  watch: {
    value () {
      // this.isFormValid()
    },
  },
  created () {
  },
  destroyed () {
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
</style>
