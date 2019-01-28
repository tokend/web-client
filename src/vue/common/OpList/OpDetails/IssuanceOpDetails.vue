<template>
  <div class="op-details">
    <table class="op-details__table">
      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.id-lbl' | globalize"
        >
          {{ 'op-details.id-lbl' | globalize }}
        </td>

        <td
          class="op-details__cell"
          :title="operation.id"
        >
          {{ operation.id }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.date-lbl' | globalize"
        >
          {{ 'op-details.date-lbl' | globalize }}
        </td>

        <td
          class="op-details__cell"
          :title="operation.date | formatCalendar"
        >
          {{ operation.date | formatCalendar }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.counterparty-lbl' | globalize"
        >
          {{ 'op-details.counterparty-lbl' | globalize }}
        </td>

        <td
          class="op-details__cell"
          :title="operation.counterparty"
        >
          {{ operation.counterparty }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.counterparty-email-lbl' | globalize"
        >
          {{ 'op-details.counterparty-email-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <email-getter :account-id="operation.counterparty" />
        </td>
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.asset-lbl' | globalize"
        >
          {{ 'op-details.asset-lbl' | globalize }}
        </td>

        <td
          class="op-details__cell"
          :title="operation.asset"
        >
          {{ operation.asset }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.amount-lbl' | globalize"
        >
          {{ 'op-details.amount-lbl' | globalize }}
        </td>

        <!-- eslint-disable max-len -->
        <td
          class="op-details__cell"
          :title="{ value: operation.amount, currency: operation.asset } | formatMoney"
        >
          {{ { value: operation.amount, currency: operation.asset } | formatMoney }}
        </td>
        <!-- eslint-enable max-len -->
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.fixed-fee-lbl' | globalize"
        >
          {{ 'op-details.fixed-fee-lbl' | globalize }}
        </td>

        <!-- eslint-disable max-len -->
        <td
          class="op-details__cell"
          :title="{ value: operation.fixedFee, currency: operation.feeAsset } | formatMoney"
        >
          {{ { value: operation.fixedFee, currency: operation.feeAsset } | formatMoney }}
        </td>
        <!-- eslint-enable max-len -->
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.percent-fee-lbl' | globalize"
        >
          {{ 'op-details.percent-fee-lbl' | globalize }}
        </td>

        <!-- eslint-disable max-len -->
        <td
          class="op-details__cell"
          :title="{ value: operation.percentFee, currency: operation.feeAsset } | formatMoney"
        >
          {{ { value: operation.percentFee, currency: operation.feeAsset } | formatMoney }}
        </td>
        <!-- eslint-enable max-len -->
      </tr>
    </table>
  </div>
</template>

<script>
import IssuanceRecord from '@/js/records/operations/issuance.record'
import EmailGetter from '@/vue/common/EmailGetter'
export default {
  name: 'issuance-op-details',
  components: { EmailGetter },
  props: {
    operation: { type: IssuanceRecord, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import "./op-details";
</style>
