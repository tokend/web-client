<template>
  <table class="deposit-table">
    <deposit-table-row
      v-for="(item, index) in pendingIssuances"
      :end-time="item.endTime"
      :amount="item.amount"
      :asset="item.asset"
      :address="item.address"
      :key="index"
    />
  </table>
</template>

<script>
import DepositTableRow from './coinpayments-deposit-table-row'

export default {
  name: 'deposit-table',
  components: {
    DepositTableRow,
  },
  props: {
    pendingIssuances: { type: Array, required: true },
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables';
  .deposit-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    tbody:nth-child(odd){
      tr:first-child {
        background: $col-table-alt-row-background;
      }
    }
  }
</style>
