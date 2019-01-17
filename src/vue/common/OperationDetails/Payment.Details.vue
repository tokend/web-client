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
        <td>{{ 'tx-pages.asset' | globalize }}</td>
        <td>{{ operation.asset }}</td>
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
        <td>{{ 'tx-pages.destination-fees' | globalize }}</td>
        <td>
          {{
            {
              value: operation.fees.destination,
              currency: operation.sourceFeeAsset
            } | formatMoney
          }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.source-fees' | globalize }}</td>
        <td>
          {{
            {
              value: operation.fees.source,
              currency: operation.destinationFeeAsset
            } | formatMoney
          }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.subject' | globalize }}</td>
        <td>{{ operation.subject }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'payment-details',
  props: {
    operation: { type: Object, required: true }
  }
}
</script>

<style lang="scss" scoped>
  @import './OperationDetails';
</style>
