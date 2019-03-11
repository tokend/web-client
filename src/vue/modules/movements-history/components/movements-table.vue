<template>
  <table class="movements-table" v-if="movements.length">
    <thead>
      <tr class="movements-table__head-row">
        <th
          class="movements-table__head-cell"
          :title="'movements-table.head.type' | globalize"
        >
          {{ 'movements-history.type-th' | globalize }}
        </th>
        <th
          class="movements-table__head-cell"
          :title="'movements-table.head.date' | globalize"
        >
          {{ 'movements-history.operation-th' | globalize }}
        </th>
        <th
          class="movements-table__head-cell"
          :title="'movements-table.head.date' | globalize"
        >
          {{ 'movements-history.date-th' | globalize }}
        </th>
        <th
          class="movements-table__head-cell"
          :title="'movements-table.head.amount' | globalize"
        >
          {{ 'movements-history.amount-th' | globalize }}
        </th>
        <th
          class="movements-table__head-cell"
          :title="'movements-table.head.fee' | globalize"
        >
          {{ 'movements-history.fee-th' | globalize }}
        </th>
        <th
          class="movements-table__head-cell
                 movements-table__head-cell--expand-btn-wrp"
        />
      </tr>
    </thead>

    <movements-table-row
      v-for="movement in movements"
      :movement="movement"
      :key="movement.id"
    />
  </table>
  <no-data-message
    v-else
    :title="'movements-history.no-movements-title' | globalize"
    :message="'movements-history.no-movements-msg' | globalize"
  />
</template>

<script>
import MovementsTableRow from './movements-table-row'
import NoDataMessage from '@/vue/common/NoDataMessage'

export default {
  name: 'movement-list-renderer',
  components: {
    MovementsTableRow,
    NoDataMessage,
  },
  props: {
    movements: {
      type: Array, /** {@link Movement} **/
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import '../scss/variables';

.movements-table {
  width: 100%;
  table-layout: fixed;
  border-spacing: 0 0.6rem;
  border-color: transparent;
  overflow-x: auto;
  padding: 0.4rem 0.4rem;
}

.movements-table__head-cell {
  padding: 0 $movements-table-cell-side-padding 1rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 1.4rem;
  color: $col-text-secondary;
  font-weight: normal;
  width: $movements-table-cell-width;

  &--direction {
    padding-right: 0;
    min-width: $movements-table-cell-width-direction;
    width: $movements-table-cell-width-direction;
  }

  &--expand-btn-wrp {
    text-align: right;
    width: $movements-table-cell-width-expand-btn-wrp;
  }
}
</style>
