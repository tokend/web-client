<template>
  <div class="details">
    <table class="details__table">
      <detail
        :label="'op-pages.id'| globalize"
        :value="operation.id"
      />
      <detail
        :label="'op-pages.date'| globalize"
        :value="operation.date | formatCalendar"
      />
      <detail
        :label="'op-pages.fund-name'| globalize"
        :value="'op-pages.token-fund' | globalize({asset: operation.baseAsset})"
      />
      <detail
        :label="'op-pages.base-asset'| globalize"
        :value="operation.baseAsset"
      />
      <detail
        :label="'op-pages.amount'| globalize"
        :value="{
          value: operation.amount,
          currency: operation.asset
        } | formatMoney"
      />
      <detail
        :label="'op-pages.fee-paid'| globalize"
        :value="{
          value: operation.feePaid,
          currency: operation.asset
        } | formatMoney"
      />
      <detail
        :label="'op-pages.price'| globalize"
        :value="{
          value: operation.price,
          currency: operation.quoteAsset
        } | formatMoney"
      />
    </table>
  </div>
</template>

<script>
import Detail from './Detail'
import MatchRecord from '@/js/records/operations/match.record'
export default {
  name: 'match-details',
  components: { Detail },
  props: {
    operation: { type: MatchRecord, required: true },
  },
}
</script>

<style lang="scss" scoped>
  @import './operation-details';
</style>
