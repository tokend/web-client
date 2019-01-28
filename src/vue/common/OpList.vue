<template>
  <div class="op-list">
    <table class="op-list__table">
      <tr class="op-list__head-row">
        <th
          class="op-list__head-cell"
          :title="'op-list.head.date' | globalize"
        >
          {{ 'op-list.head.date' | globalize }}
        </th>
        <th
          class="op-list__head-cell"
          :title="'op-list.head.tx-type' | globalize"
        >
          {{ 'op-list.head.tx-type' | globalize }}
        </th>
        <th
          class="op-list__head-cell"
          :title="'op-list.head.amount' | globalize"
        >
          {{ 'op-list.head.amount' | globalize }}
        </th>
        <th
          class="op-list__head-cell op-list__head-cell--counterparty"
          :title="'op-list.head.counterparty' | globalize"
        >
          {{ 'op-list.head.counterparty' | globalize }}
        </th>
        <th
          class="op-list__head-cell op-list__head-cell--status"
          :title="'op-list.head.status' | globalize"
        >
          {{ 'op-list.head.status' | globalize }}
        </th>
        <th class="op-list__head-cell op-list__head-cell--toggle" />
      </tr>

      <op-list-row
        v-for="(operation, i) in list"
        :key="`op-row-${i}}`"
        :operation="operation"
      />
    </table>
  </div>
</template>

<script>
import OpListRow from './OpList/OpListRow'

export default {
  name: 'op-list',

  components: {
    OpListRow,
  },

  props: {
    list: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "OpList/op-list-variables";

.op-list {
  width: 100%;
}

.op-list__table {
  width: 100%;
  table-layout: fixed;
  border-spacing: 0 0.6rem;
  border-color: transparent;
  overflow-x: auto;
}

.op-list__head-cell {
  padding: 0 $op-list-cell-side-padding 1rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 1.4rem;
  color: $col-text-secondary;
  font-weight: normal;
  width: $op-list-col-width;

  &--counterparty {
    width: $op-list-counterparty-col-width;
  }

  &--status {
    width: $op-list-status-col-width;
  }

  &--toggle {
    text-align: right;
    width: $op-list-toggle-btn-col-width;
  }
}
</style>
