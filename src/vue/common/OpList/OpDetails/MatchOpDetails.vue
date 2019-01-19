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
          {{ 'op-details.fund-name-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <!-- eslint-disable-next-line max-len -->
          {{ 'op-details.token-fund-val' | globalize({ asset: operation.baseAsset }) }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.base-asset-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          {{ operation.baseAsset }}
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
          {{ 'op-details.fee-paid-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <!-- eslint-disable-next-line max-len -->
          {{ { value: operation.feePaid, currency: operation.asset } | formatMoney }}
        </td>
      </tr>

      <tr class="op-details__row">
        <td class="op-details__cell">
          {{ 'op-details.price-lbl' | globalize }}
        </td>

        <td class="op-details__cell">
          <!-- eslint-disable-next-line max-len -->
          {{ { value: operation.price, currency: operation.quoteAsset } | formatMoney }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import MatchRecord from '@/js/records/operations/match.record'
export default {
  name: 'match-details',
  props: {
    operation: { type: MatchRecord, required: true },
  },
}
</script>

<style lang="scss" scoped>
  @import './op-details';
</style>
