<template>
  <div class="op-details">
    <table class="op-details__table">
      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-pages.id-lbl' | globalize }}
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
