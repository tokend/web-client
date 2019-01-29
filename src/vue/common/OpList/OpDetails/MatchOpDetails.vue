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
          :title="'op-details.fund-name-lbl' | globalize"
        >
          {{ 'op-details.fund-name-lbl' | globalize }}
        </td>

        <!-- eslint-disable max-len -->
        <td
          class="op-details__cell"
          :title="'op-details.token-fund-val' | globalize({ asset: operation.baseAsset })"
        >
          {{ 'op-details.token-fund-val' | globalize({ asset: operation.baseAsset }) }}
        </td>
        <!-- eslint-enable max-len -->
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.base-asset-lbl' | globalize"
        >
          {{ 'op-details.base-asset-lbl' | globalize }}
        </td>

        <td
          class="op-details__cell"
          :title="operation.baseAsset"
        >
          {{ operation.baseAsset }}
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
          :title="'op-details.fee-paid-lbl' | globalize"
        >
          {{ 'op-details.fee-paid-lbl' | globalize }}
        </td>

        <!-- eslint-disable max-len -->
        <td
          class="op-details__cell"
          :title="{ value: operation.feePaid, currency: operation.asset } | formatMoney"
        >
          {{ { value: operation.feePaid, currency: operation.asset } | formatMoney }}
        </td>
        <!-- eslint-enable max-len -->
      </tr>

      <tr class="op-details__row">
        <td
          class="op-details__cell"
          :title="'op-details.price-lbl' | globalize"
        >
          {{ 'op-details.price-lbl' | globalize }}
        </td>

        <!-- eslint-disable max-len -->
        <td
          class="op-details__cell"
          :title="{ value: operation.price, currency: operation.quoteAsset } | formatMoney"
        >
          {{ { value: operation.price, currency: operation.quoteAsset } | formatMoney }}
        </td>
        <!-- eslint-enable max-len -->
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
