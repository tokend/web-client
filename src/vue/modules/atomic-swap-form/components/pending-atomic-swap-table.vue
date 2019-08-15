<template>
  <table class="pending-atomic-swap-table">
    <pending-atomic-swap-table-row
      v-for="(item, index) in pendingAtomicSwapBids"
      :end-time="item.endTime"
      :amount="item.amount"
      :asset="item.quoteAssetCode"
      :address="item.address"
      :key="index"
      :expanded="selectedAtomicSwapBids === item.address"
      @expand-requested="selectAtomicSwapBids(item.address)"
    />
  </table>
</template>

<script>
import PendingAtomicSwapTableRow from './pending-atomic-swap-table-row'

export default {
  name: 'pending-atomic-swap-table',
  components: {
    PendingAtomicSwapTableRow,
  },
  props: {
    pendingAtomicSwapBids: { type: Array, required: true },
  },
  data: () => ({
    selectedAtomicSwapBids: null,
  }),
  methods: {
    resetAtomicSwapBidsSelection () {
      this.selectedAtomicSwapBids = null
    },
    selectAtomicSwapBids (address) {
      if (this.selectedAtomicSwapBids === address) {
        this.selectedAtomicSwapBids = null
      } else {
        this.selectedAtomicSwapBids = address
      }
    },
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables';

  .pending-atomic-swap-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .pending-atomic-swap-table tbody:nth-child(odd) tr:first-child {
    background: $col-table-alt-row-background;
  }
</style>
