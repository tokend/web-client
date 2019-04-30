<template>
  <table
    v-if="ifFeesDownloaded"
    class="fees-renderer"
  >
    <tbody
      class="fees-component__tbody"
      :class="{ 'fees-renderer__data--loading': isFeesLoadPending }"
    >
      <tr
        class="fees-renderer__strong"
        v-if="fees.IsAnyExternalFee"
      >
        <td>
          {{ 'fees-renderer.network-fee-hint' | globalize }}
        </td>
        <td>
          {{ 'fees-renderer.network-fee-unknown' | globalize }}
        </td>
      </tr>
      <tr>
        <td>
          {{ 'fees-renderer.source-fixed-fee' | globalize }}
        </td>
        <td>
          <template v-if="paidForDestination">
            {{
              formatFeeSum([
                fees.source.fixed,
                fees.destination.fixed
              ])
            }}
          </template>
          <template v-else>
            {{ formatFee(fees.source.fixed) }}
          </template>
        </td>
      </tr>
      <tr>
        <td>
          {{ 'fees-renderer.source-percent-fee' | globalize }}
        </td>
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
          <td>
            {{ 'fees-renderer.destination-fixed-fee' | globalize }}
          </td>
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
            {{ 'fees-renderer.destination-percent-fee' | globalize }}
          </td>
          <td>
            <template v-if="paidForDestination">
              {{ formatFee(0) }}
            </template>
            <template v-else>
              {{
                formatFee(
                  fees.destination.calculatedPercent
                )
              }}
            </template>
          </td>
        </tr>
      </template>

      <tr class="fees-renderer__total-fee-row">
        <td>
          {{ 'fees-renderer.source-fixed-total-fee' | globalize }}
        </td>
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

      <tr
        class="fees-renderer__total-fee-row"
      >
        <td>
          {{ 'fees-renderer.destination-fixed-total-fee' | globalize }}
        </td>
        <td>
          <template v-if="paidForDestination">
            {{
              formatFeeSum([0])
            }}
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

      <tr
        v-if="fees.isAnyDestinationFee && !fees.isWithdrawalFees"
      >
        <td class="fees-renderer__tick-field">
          <tick-field v-model="isPaidForRecipient">
            {{ 'fees-renderer.pay-fees-for-recipient' | globalize }}
          </tick-field>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import FormMixin from '@/vue/mixins/form.mixin'
import { CoupledFeesRecord } from './fees.record'

const EVENTS = {
  paidForDestination: 'paidForDestination',
}

export default {
  name: 'fees',
  mixins: [
    FormMixin,
    IdentityGetterMixin,
  ],
  props: {
    fees: {
      type: Object,
      default: () => CoupledFeesRecord,
    },
    paidForDestination: {
      type: Boolean,
      default: () => false,
    },
  },
  data () {
    return {
      isFeesLoadPending: false,
      isPaidForRecipient: false,
    }
  },
  computed: {
    ifFeesDownloaded () {
      return Boolean(Object.keys(this.fees).length)
    },
  },
  watch: {
    paidForDestination () {
      this.$emit(
        EVENTS.paidForDestination,
        this.isPaidForRecipient
      )
    },
  },
  created () {
    this.isPaidForRecipient = this.paidForDestination
  },

  methods: {
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
@import "@/scss/variables";

.fees-renderer {
  width: 100%;
  font-size: 1.2rem;
  tr {
    height: 2rem;
  }
  td:last-child {
    text-align: right;
  }
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
  padding: 1.2rem 0rem;
}
.fees-renderer__strong {
  font-weight: 600;
  color: $col-text;
}
</style>
