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
          :title="'op-details.destination-fees-lbl' | globalize"
        >
          {{ 'op-details.destination-fees-lbl' | globalize }}
        </td>

        <!-- eslint-disable max-len -->
        <td
          class="op-details__cell"
          :title="{ value: operation.fees.destination, currency: operation.sourceFeeAsset } | formatMoney"
        >
          {{ { value: operation.fees.destination, currency: operation.sourceFeeAsset } | formatMoney }}
        </td>
        <!-- eslint-enable max-len -->
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.source-fees-lbl' | globalize"
        >
          {{ 'op-details.source-fees-lbl' | globalize }}
        </td>

        <!-- eslint-disable max-len -->
        <td
          class="op-details__cell"
          :title="{ value: operation.fees.source, currency: operation.destinationFeeAsset } | formatMoney"
        >
          {{ { value: operation.fees.source, currency: operation.destinationFeeAsset } | formatMoney }}
        </td>
        <!-- eslint-enable max-len -->
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.subject-lbl' | globalize"
        >
          {{ 'op-details.subject-lbl' | globalize }}
        </td>

        <td
          class="op-details__cell"
          :title="operation.subject"
        >
          {{ operation.subject }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import PaymentRecord from '@/js/records/operations/payment.record'
import EmailGetter from '@/vue/common/EmailGetter'
export default {
  name: 'payment-op-details',
  components: { EmailGetter },
  props: {
    operation: { type: PaymentRecord, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import "./op-details";
</style>
