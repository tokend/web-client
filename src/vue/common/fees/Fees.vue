<template>
  <table class="fees-renderer">
    <tbody
      class="fees-component__tbody"
      :class="{ 'fees-renderer__data--loading': isFeesLoadPending }"
    >
      <tr
        class="fees_renderer__didcated-text"
        v-if="+fees.externalSystemType && fees.isWithdrawalFees"
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
              formatFee(
                fees.source.fixed,
                fees.destination.fixed
              )
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
              formatFee(
                fees.source.calculatedPercent,
                fees.destination.calculatedPercent
              )
            }}
          </template>
          <template v-else>
            {{ formatFee(fees.source.calculatedPercent) }}
          </template>
        </td>
      </tr>
      <template v-if="!fees.isWithdrawalFees">
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
        <tr>
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
            {{ formatTotalFeeSum(0) }}
          </template>
          <template v-else>
            {{
              formatTotalFee({
                fixed: fees.source.fixed,
                percent: fees.source.calculatedPercent
              })
            }}
          </template>
        </td>
      </tr>

      <tr
        class="fees-renderer__total-fee-row"
        v-if="!fees.isWithdrawalFees"
      >
        <td>
          {{ 'fees-renderer.destination-fixed-total-fee' | globalize }}
        </td>
        <td>
          <template v-if="paidForDestination">
            {{
              formatTotalFee({
                fixed: 0,
                percent: 0
              })
            }}
          </template>
          <template v-else>
            {{
              formatTotalFee({
                fixed: fees.destination.fixed,
                percent: fees.destination.calculatedPercent
              })
            }}
          </template>
        </td>
      </tr>

      <tr
        v-if="fees.isAnyFeeForDestination && !fees.isWithdrawalFees"
      >
        <td class="fees-renderer__tick-field">
          <tick-field v-model="paidForDestination">
            {{ 'fees-renderer.pay-fees-for-recipient' | globalize }}
          </tick-field>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { formatMoney } from '@/vue/filters/formatMoney'
import { MathUtil } from '@/js/utils'
import IdentityGetterMixin from '@/vue/mixins/identity-getter'
import FormMixin from '@/vue/mixins/form.mixin'
import { FeesRecord } from '@/js/records/entities/fees.record'

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
      default: () => FeesRecord,
    },
    assetCode: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      isFeesLoadPending: false,
      paidForDestination: false,
    }
  },
  watch: {
    paidForDestination () {
      this.$emit(
        EVENTS.paidForDestination,
        this.paidForDestination
      )
    },
  },
  methods: {
    formatMoney,
    formatFee (fee) {
      const feeData = {
        value: fee,
        currency: this.fees.assetCode,
      }
      return this.$options.filters.formatMoney(
        feeData
      )
    },
    formatFeeSum (...fees) {
      const feeSumData = {
        value: fees.reduce((sum, item) => sum + item),
        currency: this.fees.assetCode,
      }
      return this.$options.filters.formatMoney(
        feeSumData
      )
    },
    formatTotalFeeSum () {
      const resultFeesFixed =
        Number(this.fees.destination.fixed) +
        Number(this.fees.source.fixed)
      const resultFeesPercent =
        Number(this.fees.destination.calculatedPercent) +
        Number(this.fees.source.calculatedPercent)
      const feeSumData = {
        value: resultFeesFixed + resultFeesPercent,
        currency: this.fees.assetCode,
      }
      return this.$options.filters.formatMoney(
        feeSumData
      )
    },
    formatTotalFee (fees) {
      const result = MathUtil.add(fees.fixed, fees.percent)
      const feeData = {
        value: result,
        currency: this.fees.assetCode,
      }
      return this.$options.filters.formatMoney(
        feeData
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
.fees_renderer__didcated-text {
  font-weight: 600;
  color: $col-text;
}
</style>
