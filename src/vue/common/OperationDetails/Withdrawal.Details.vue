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
        <td>{{ 'tx-pages.counterparty' | globalize }}</td>
        <td>{{ operation.counterparty }}</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.counterparty-email' | globalize }}</td>
        <td>{{ operation.counterparty }} Email</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.destination-asset' | globalize }}</td>
        <td>{{ operation.destinationAsset }}</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.destination-amount' | globalize }}</td>
        <td>
          {{
            {
              value: operation.destinationAmount,
              currency: operation.destinationAsset } |
              formatMoney
          }}
        </td>
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
        <td>{{ 'tx-pages.fixed-fee' | globalize }}</td>
        <td>
          {{
            { value: operation.fixedFee, currency: operation.feeAsset } |
              formatMoney
          }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.percentFee' | globalize }}</td>
        <td>
          {{
            { value: operation.percentFee, currency: operation.feeAsset } |
              formatMoney
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'withdrawal-details',
  props: {
    operation: { type: Object, required: true }
  }
}
</script>

<style lang="scss" scoped>
  @import './operation-details';
</style>
