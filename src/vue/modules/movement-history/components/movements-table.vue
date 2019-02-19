<template>
  <table class="movements-table">
    <thead>
      <tr class="movements-table__head-row">
        <th
          class="movements-table__head-cell
                 movements-table__head-cell--direction" />
        <th
          class="movements-table__head-cell"
          :title="'movements-table.head.type' | globalize"
        >
          {{ 'movements-history.table-head.type' | globalize }}
        </th>
        <th
          class="movements-table__head-cell"
          :title="'movements-table.head.date' | globalize"
        >
          {{ 'movements-history.table-head.date' | globalize }}
        </th>
        <th
          class="movements-table__head-cell"
          :title="'movements-table.head.amount' | globalize"
        >
          {{ 'movements-history.table-head.amount' | globalize }}
        </th>
        <th
          class="movements-table__head-cell"
          :title="'movements-table.head.fee' | globalize"
        >
          {{ 'movements-history.table-head.fee' | globalize }}
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
</template>

<script>
import MovementsTableRow from './movements-table-row'

export default {
  name: 'movement-list-renderer',
  components: {
    MovementsTableRow,
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
    width: $movements-table-cell-width-direction;
  }

  &--expand-btn-wrp {
    text-align: right;
    width: $movements-table-cell-width-expand-btn-wrp;
  }
}
</style>
