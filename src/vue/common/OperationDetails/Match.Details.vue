<template>
  <div class="details">
    <table class="details__table">
      <tr>
        <td>{{ 'tx-pages.id' | globalize }}</td>
        <td>{{ operation.id }}</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.date' | globalize }}</td>
        <td>{{ operation.date | formatCalendar }}</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.fund-name' | globalize }}</td>
        <td>
          {{ 'tx-pages.token-fund' | globalize({asset: operation.baseAsset}) }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.base-asset' | globalize }}</td>
        <td>{{ operation.baseAsset }}</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.amount' | globalize }}</td>
        <td>
          {{
            { value: operation.amount, currency: operation.asset } |
              formatMoney
          }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.fee-paid' | globalize }}</td>
        <td>
          {{
            { value: operation.feePaid, currency: operation.asset } |
              formatMoney
          }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.price' | globalize }}</td>
        <td>
          {{
            { value: operation.price, currency: operation.quoteAsset } |
              formatMoney
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'match-details',
  props: {
    operation: { type: Object, required: true }
  }
}
</script>

<style lang="scss" scoped>
  @import './OperationDetails';
</style>
