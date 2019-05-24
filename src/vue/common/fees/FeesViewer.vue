<template>
  <table
    v-if="isFeesLoaded"
    class="fees-renderer"
  >
    <tbody class="fees-component__tbody">
      <tr
        v-if="fees.IsAnyExternalFee"
        class="fees-renderer__strong"
      >
        <td>{{ 'fees-renderer.network-fee-lbl' | globalize }}</td>
        <td>{{ 'fees-renderer.network-fee-unknown-lbl' | globalize }}</td>
      </tr>

      <tr>
        <td>{{ 'fees-renderer.source-fixed-fee-lbl' | globalize }}</td>
        <td>
          <template v-if="paidForDestination">
            {{ formatFeeSum([fees.source.fixed, fees.destination.fixed]) }}
          </template>

          <template v-else>
            {{ formatFee(fees.source.fixed) }}
          </template>
        </td>
      </tr>

      <tr>
        <td>{{ 'fees-renderer.source-percent-fee-lbl' | globalize }}</td>
        <td>
          <template v-if="paidForDestination">
            {{
              formatFeeSum([
                fees.source.calculatedPercent,
                fees.destination.calculatedPercent
              ])
            }}
          </template>

          <template v-else>
            {{ formatFee(fees.source.calculatedPercent) }}
          </template>
        </td>
      </tr>

      <template v-if="fees.destination.fixed">
        <tr>
          <td>{{ 'fees-renderer.destination-fixed-fee-lbl' | globalize }}</td>
          <td>
            <template v-if="paidForDestination">
              {{ formatFee(0) }}
            </template>

            <template v-else>
              {{ formatFee(fees.destination.fixed) }}
            </template>
          </td>
        </tr>

        <tr v-if="fees.destination.calculatedPercent">
          <td>
            {{ 'fees-renderer.destination-percent-fee-lbl' | globalize }}
          </td>

          <td>
            <template v-if="paidForDestination">
              {{ formatFee(0) }}
            </template>

            <template v-else>
              {{ formatFee(fees.destination.calculatedPercent) }}
            </template>
          </td>
        </tr>
      </template>

      <tr class="fees-renderer__total-fee-row">
        <td>{{ 'fees-renderer.source-fixed-total-fee-lbl' | globalize }}</td>
        <td>
          <template v-if="paidForDestination">
            {{
              formatFeeSum([
                fees.destination.fixed,
                fees.source.fixed,
                fees.destination.calculatedPercent,
                fees.source.calculatedPercent,
              ])
            }}
          </template>

          <template v-else>
            {{
              formatFeeSum([
                fees.source.fixed,
                fees.source.calculatedPercent
              ])
            }}
          </template>
        </td>
      </tr>

      <tr class="fees-renderer__total-fee-row">
        <td>
          {{ 'fees-renderer.destination-fixed-total-fee-lbl' | globalize }}
        </td>

        <td>
          <template v-if="paidForDestination">
            {{ formatFeeSum([0]) }}
          </template>

          <template v-else>
            {{
              formatFeeSum([
                fees.destination.fixed,
                fees.destination.calculatedPercent
              ])
            }}
          </template>
        </td>
      </tr>

      <tr v-if="fees.isAnyDestinationFee && !fees.isWithdrawalFees">
        <td class="fees-renderer__tick-field">
          <tick-field
            :value="paidForDestination"
            @input="$emit"
          >
            {{ 'fees-renderer.pay-fees-for-recipient-lbl' | globalize }}
          </tick-field>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import FormMixin from '@/vue/mixins/form.mixin'

const EVENTS = {
  updatePaidForDestination: 'update:paidForDestination',
}

export default {
  name: 'fees-viewer',
  mixins: [FormMixin, IdentityGetterMixin],

  props: {
    fees: { type: Object, default: () => ({}) },
    paidForDestination: { type: Boolean, default: false },
  },

  data () {
    return {
      isPaidForRecipient: false,
    }
  },

  computed: {
    isFeesLoaded () {
      return Boolean(Object.keys(this.fees).length)
    },
  },

  watch: {
    paidForDestination () {
      this.$emit(
        EVENTS.updatePaidForDestination,
        this.isPaidForRecipient
      )
    },
  },

  created () {
    this.isPaidForRecipient = this.paidForDestination
  },

  methods: {
    updatePaidForDestination (value) {
      this.$emit(EVENTS.updatePaidForDestination, value)
    },

    formatFee (fee) {
      const fees = {
        value: fee,
        currency: this.fees.assetCode,
      }
      return this.$options.filters.formatMoney(
        fees
      )
    },

    formatFeeSum (...fees) {
      return this.formatFee(
        fees.reduce((sum, item) => sum + item)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/variables';

.fees-renderer {
  width: 100%;
  font-size: 1.2rem;

  /* stylelint-disable selector-nested-pattern */
  tr {
    height: 2rem;
  }

  td:last-child {
    text-align: right;
  }
  /* stylelint-enable selector-nested-pattern */
}

.fees-renderer__tbody {
  color: $col-text-secondary;
}

.fees-renderer__total-fee-row {
  color: $col-text;
  font-weight: 600;
}

.fees-renderer__data--loading {
  opacity: 0.4;
}

.fees-renderer__tick-field {
  padding: 1.2rem 0;
}

.fees-renderer__strong {
  font-weight: 600;
  color: $col-text;
}

</style>
