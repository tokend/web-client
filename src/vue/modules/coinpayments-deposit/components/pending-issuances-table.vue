<template>
  <table class="pending-issuances-table">
    <pending-issuances-table-row
      v-for="(item, index) in pendingIssuances"
      :end-time="item.endTime"
      :amount="item.amount"
      :asset="item.asset"
      :address="item.address"
      :key="index"
      :selected-issuance="selectedIssuance"
      @issuance-selected="issuanceSelected"
      @reset-issuance-selection="resetIssuanceSelection"
    />
  </table>
</template>

<script>
import PendingIssuancesTableRow from './pending-issuances-table-row'

export default {
  name: 'pending-issuances-table',
  components: {
    PendingIssuancesTableRow,
  },
  props: {
    pendingIssuances: { type: Array, required: true },
    addressCreated: { type: Boolean, required: true },
  },
  data: () => ({
    selectedIssuance: null,
  }),
  watch: {
    addressCreated (value) {
      if (value) {
        this.resetIssuanceSelection()
      }
    },
  },
  methods: {
    issuanceSelected (issuance) {
      this.selectedIssuance = issuance
    },
    resetIssuanceSelection () {
      this.selectedIssuance = null
    },
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables';

  .pending-issuances-table {
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
