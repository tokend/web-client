<template>
  <div class="op-details">
    <table class="op-details__table">
      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.id-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          {{ operation.id }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.date-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          {{ operation.date | formatCalendar }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.counterparty-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          {{ operation.counterparty }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.counterparty-email-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <email-getter :account-id="operation.counterparty" />
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.asset-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          {{ operation.asset }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.amount-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <!-- eslint-disable-next-line max-len -->
          {{ { value: operation.amount, currency: operation.asset } | formatMoney }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.destination-fees-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <!-- eslint-disable-next-line max-len -->
          {{ { value: operation.fees.destination, currency: operation.sourceFeeAsset } | formatMoney }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.source-fees-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <!-- eslint-disable-next-line max-len -->
          {{ { value: operation.fees.source, currency: operation.destinationFeeAsset } | formatMoney }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.subject-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
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
