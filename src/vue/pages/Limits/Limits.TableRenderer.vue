<template>
  <div v-if="!isLoading" class="limits-table-renderer__table app__table">
    <table class="app__table">
      <thead>
        <tr>
          <th>
            {{ 'limits-table-renderer.table-tx-type-lbl' | globalize }}
          </th>
          <th>
            {{ 'limits-table-renderer.table-daily-limit-lbl' | globalize }}
          </th>
          <th>
            {{ 'limits-table-renderer.table-weekly-limit-lbl' | globalize }}
          </th>
          <th>
            {{ 'limits-table-renderer.table-monthly-limit-lbl' | globalize }}
          </th>
          <th>
            {{ 'limits-table-renderer.table-annual-limit-lbl' | globalize }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in limits" :key="`limits-table-row-${i}`">
          <td>
            {{ OPERATION_TYPES_TRANSLATION_ID[item.statsOpType] | globalize }}
          </td>
          <td>
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.dailySpent }">
              <!-- eslint-disable-next-line -->
              {{ item.dailySpent || 'limits-table-renderer.not-set-lbl' | globalize }}
            </span>
            /
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.dailyOut }">
              <!-- eslint-disable-next-line -->
              {{ item.dailyOut || 'limits-table-renderer.not-set-lbl' | globalize }}
            </span>
          </td>
          <td>
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.weeklySpent }">
              <!-- eslint-disable-next-line -->
              {{ item.weeklySpent || 'limits-table-renderer.not-set-lbl' | globalize }}
            </span>
            /
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.weeklyOut }">
              <!-- eslint-disable-next-line -->
              {{ item.weeklyOut || 'limits-table-renderer.not-set-lbl' | globalize }}
            </span>
          </td>
          <td>
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.monthlySpent }">
              <!-- eslint-disable-next-line -->
              {{ item.monthlySpent || 'limits-table-renderer.not-set-lbl' | globalize }}
            </span>
            /
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.monthlyOut }">
              <!-- eslint-disable-next-line -->
              {{ item.monthlyOut || 'limits-table-renderer.not-set-lbl' | globalize }}
            </span>
          </td>
          <td>
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.annualSpent }">
              <!-- eslint-disable-next-line -->
              {{ item.annualSpent || 'limits-table-renderer.not-set-lbl' | globalize }}
            </span>
            /
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.annualOut }">
              <!-- eslint-disable-next-line -->
              {{ item.annualOut || 'limits-table-renderer.not-set-lbl' | globalize }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <loader v-else :message-id="'limits-table-renderer.data-loading'" />
</template>

<script>
import { STATS_OPERATION_TYPES } from '@tokend/js-sdk'
import Loader from '@/vue/common/Loader'

const OPERATION_TYPES_TRANSLATION_ID = {
  [STATS_OPERATION_TYPES.deposit]: 'limits-table-renderer.op-type-deposit',
  [STATS_OPERATION_TYPES.withdraw]: 'limits-table-renderer.op-type-withdraw',
  // eslint-disable-next-line
  [STATS_OPERATION_TYPES.paymentOut]: 'limits-table-renderer.op-type-payment-out',
}

export default {
  name: 'limits-table-renderer',
  components: { Loader },
  props: {
    limits: { type: Object, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
  },
  data: () => ({
    OPERATION_TYPES_TRANSLATION_ID,
  }),
}
</script>

<style lang="scss">
@import "~@scss/variables";

.limits-table-renderer__table-item--inactive {
  color: $col-table-cell-text-inactive;
}

</style>
