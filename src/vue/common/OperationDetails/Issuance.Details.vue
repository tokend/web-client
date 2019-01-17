<template>
  <div class="details">
    <table class="details__table">
      <detail :label="'op-pages.id'| globalize" :value="operation.id" />
      <detail
        :label="'op-pages.date'| globalize"
        :value="operation.date | formatCalendar"
      />
      <detail
        :label="'op-pages.counterparty'| globalize"
        :value="operation.counterparty"
      />
      <tr>
        <td>{{ 'op-pages.counterparty-email' | globalize }}</td>
        <td>{{ operation.counterparty }} Email</td>
      </tr>
      <detail
        :label="'op-pages.asset'| globalize"
        :value="operation.asset"
      />
      <detail
        :label="'op-pages.amount'| globalize"
        :value="{
          value: operation.amount,
          currency: operation.asset
        } | formatMoney"
      />
      <detail
        :label="'op-pages.fixed-fee'| globalize"
        :value="{
          value: operation.fixedFee,
          currency: operation.feeAsset
        } | formatMoney"
      />
      <detail
        :label="'op-pages.percentFee'| globalize"
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
import IssuanceRecord from '@/js/records/operations/issuance.record'
export default {
  name: 'issuance-details',
  components: { Detail },
  props: {
    operation: { type: IssuanceRecord, required: true },
  },
}
</script>

<style lang="scss" scoped>
  @import './operation-details';
</style>
