<template>
  <table
    v-if="isFeesLoaded"
    class="fees-renderer"
  >
    <tbody class="fees-renderer__tbody">
      <!-- currently disabled -->
      <!-- <tr
        v-if="false"
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
      </tr> -->
      <tr v-for="(fee, i) in fees.valuableFees" :key="i">
        <td>{{ fee | formatFeeDirection }}</td>
        <td>{{ formatFee(fee.fixed) | formatMoney }}</td>
        <td>{{ formatFee(fee.calculatedPercent) | formatMoney }}</td>
        <td>{{ formatFee(fee.total) | formatMoney }}</td>
      </tr>

      <!-- temporarily disabled -->
      <!-- <tr v-if="fees.isAnyDestinationFee && !fees.isWithdrawalFees"> -->
      <tr>
        <td class="fees-renderer__tick-field">
          <tick-field
            :value="paidForDestination"
            @input="updatePaidForDestination"
          >
            {{ 'fees-renderer.pay-fees-for-recipient-lbl' | globalize }}
          </tick-field>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import TickField from '@/vue/fields/TickField'
import { FeesCollection } from './fees-collection'

const EVENTS = {
  updatePaidForDestination: 'update:paidForDestination',
}

export default {
  name: 'fees-renderer',
  components: { TickField },

  filters: {
    formatFeeDirection (fee) {
      if (fee.isIncoming) {
        return 'Recipient fee'
      } else if (fee.isOutgoing) {
        return 'Sender fee'
      } else {
        return 'Unknown fee'
      }
    },
  },

  props: {
    fees: { type: FeesCollection, required: true },
    paidForDestination: { type: Boolean, default: false },
  },

  computed: {
    isFeesLoaded () {
      return Boolean(Object.keys(this.fees).length)
    },
  },

  methods: {
    updatePaidForDestination (value) {
      this.fees.isPaidForDestination = value
      this.$emit(EVENTS.updatePaidForDestination, value)
    },

    formatFee (fee) {
      return {
        value: fee,
        currency: this.fees.assetCode,
      }
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
