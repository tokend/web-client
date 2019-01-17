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
        :label="'tx-pages.destination-asset'| globalize"
        :value="operation.destinationAsset"
      />
      <detail
        :label="'tx-pages.destination-amount'| globalize"
        :value="{
          value: operation.destinationAmount,
          currency: operation.destinationAsset
        } | formatMoney"
      />
      <detail
        :label="'tx-pages.amount'| globalize"
        :value="{
          value: operation.amount,
          currency: operation.asset
        } | formatMoney"
      />
      <detail
        :label="'tx-pages.fixed-fee'| globalize"
        :value="{
          value: operation.fixedFee,
          currency: operation.feeAsset
        } | formatMoney"
      />
      <detail
        :label="'tx-pages.percentFee'| globalize"
        :value="{
          value: operation.percentFee,
          currency: operation.feeAsset
        } | formatMoney"
      />
    </table>
  </div>
</template>

<script>
import Detail from './Detail'
import WithdrawRecord from '@/js/records/operations/withdraw.record'
export default {
  name: 'withdrawal-details',
  components: { Detail },
  props: {
    operation: { type: WithdrawRecord, required: true }
  }
}
</script>

<style lang="scss" scoped>
  @import './operation-details';
</style>
