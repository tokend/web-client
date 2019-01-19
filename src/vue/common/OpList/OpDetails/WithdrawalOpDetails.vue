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
          {{ 'op-details.destination-asset-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          {{ operation.destinationAsset }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.destination-amount-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <!-- eslint-disable-next-line max-len -->
          {{ { value: operation.destinationAmount, currency: operation.destinationAsset } | formatMoney }}
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
          {{ 'op-details.fixed-fee-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <!-- eslint-disable-next-line max-len -->
          {{ { value: operation.fixedFee, currency: operation.feeAsset } | formatMoney }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.percent-fee-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <!-- eslint-disable-next-line max-len -->
          {{ { value: operation.percentFee, currency: operation.feeAsset } | formatMoney }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import WithdrawRecord from '@/js/records/operations/withdraw.record'
import EmailGetter from '@/vue/common/EmailGetter'
export default {
  name: 'withdrawal-op-details',
  components: { EmailGetter },
  props: {
    operation: { type: WithdrawRecord, required: true },
  },
}
</script>

<style lang="scss" scoped>
  @import './op-details';
</style>
