<template>
  <table class="user-movements-table">
    <thead>
      <tr class="user-movements-table__head-row">
        <th
          class="user-movements-table__head-cell"
          :title="'user-movements-history.type-th' | globalize"
        >
          {{ 'user-movements-history.type-th' | globalize }}
        </th>
        <th
          class="user-movements-table__head-cell"
          :title="'user-movements-history.date-th' | globalize"
        >
          {{ 'user-movements-history.date-th' | globalize }}
        </th>
        <th
          class="user-movements-table__head-cell"
          :title="'user-movements-history.amount-th' | globalize"
        >
          {{ 'user-movements-history.amount-th' | globalize }}
        </th>
        <th
          class="user-movements-table__head-cell
                 user-movements-table__head-cell--expand-btn-wrp"
        />
      </tr>
    </thead>

    <movements-table-row
      v-for="movement in movements"
      :movement="movement"
      :key="movement.id"
    />
    <empty-tbody-placeholder
      v-if="!movements.length && isMovementsLoaded"
    />
    <template v-for="index in 3">
      <movements-skeleton-loader
        v-if="!isMovementsLoaded && !movements.length"
        :key="index"
      />
    </template>
  </table>
</template>

<script>
import MovementsTableRow from './user-movements-table-row'
import MovementsSkeletonLoader from './user-movements-skeleton-loader.vue'
import EmptyTbodyPlaceholder from './user-movements-empty-list-placeholder.vue'

export default {
  name: 'movement-list-renderer',
  components: {
    MovementsTableRow,
    MovementsSkeletonLoader,
    EmptyTbodyPlaceholder,
  },
  props: {
    movements: {
      type: Array, /** {@link Movement} **/
      required: true,
    },
    isMovementsLoaded: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '../scss/variables';

.user-movements-table {
  width: 100%;
  table-layout: fixed;
  border-spacing: 0 0.6rem;
  border-color: transparent;
  overflow-x: auto;
  padding: 0.4rem;
}

.user-movements-table__head-cell {
  padding: 0 $user-movements-table-cell-side-padding 1rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 1.4rem;
  color: $col-text-secondary;
  font-weight: 400;
  width: $user-movements-table-cell-width;

  &--direction {
    padding-right: 0;
    min-width: $user-movements-table-cell-width-direction;
    width: $user-movements-table-cell-width-direction;
  }

  &--expand-btn-wrp {
    text-align: right;
    width: $user-movements-table-cell-width-expand-btn-wrp;
  }
}
</style>
