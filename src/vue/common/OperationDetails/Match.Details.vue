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
        :label="'tx-pages.fund-name'| globalize"
        :value="'tx-pages.token-fund' | globalize({asset: operation.baseAsset})"
      />
      <detail
        :label="'tx-pages.base-asset'| globalize"
        :value="operation.baseAsset"
      />
      <detail
        :label="'tx-pages.amount'| globalize"
        :value="{
          value: operation.amount,
          currency: operation.asset
        } | formatMoney"
      />
      <detail
        :label="'tx-pages.fee-paid'| globalize"
        :value="{
          value: operation.feePaid,
          currency: operation.asset
        } | formatMoney"
      />
      <detail
        :label="'tx-pages.price'| globalize"
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
export default {
  name: 'match-details',
  components: { Detail },
  props: {
    operation: { type: Object, required: true }
  }
}
</script>

<style lang="scss" scoped>
  @import './operation-details';
</style>
