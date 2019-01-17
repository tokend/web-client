<template>
  <div class="details">
    <table class="details__table">
      <detail
        :label="'tx-pages.id'| globalize"
        :value="operation.id"
      />
      <detail
        :label="'tx-pages.date'| globalize"
        :value="operation.date | formatCalendar"
      />
      <detail
        :label="'tx-pages.counterparty'| globalize"
        :value="operation.counterparty"
      />
      <tr>
        <td>{{ 'tx-pages.counterparty-email' | globalize }}</td>
        <td>{{ operation.counterparty }} Email</td>
      </tr>
      <detail
        :label="'tx-pages.asset'| globalize"
        :value="operation.asset"
      />
      <detail
        :label="'tx-pages.amount'| globalize"
        :value="{
          value: operation.amount,
          currency: operation.asset
        } | formatMoney"
      />
      <detail
        :label="'tx-pages.destination-fees'| globalize"
        :value="{
          value: operation.fees.destination,
          currency: operation.sourceFeeAsset
        } | formatMoney"
      />
      <detail
        :label="'tx-pages.source-fees'| globalize"
        :value="{
          value: operation.fees.source,
          currency: operation.destinationFeeAsset
        } | formatMoney"
      />
      <detail
        :label="'tx-pages.subject'| globalize"
        :value="operation.subject"
      />
    </table>
  </div>
</template>

<script>
import Detail from './Detail'
export default {
  name: 'payment-details',
  components: { Detail },
  props: {
    operation: { type: Object, required: true }
  }
}
</script>

<style lang="scss" scoped>
  @import './operation-details';
</style>
