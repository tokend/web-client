<template>
  <div
    v-if="!isLoading && !isLoadingFailed"
    class="limits-table-renderer__table app__table"
  >
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
  <loader
    v-else-if="isLoading && !isLoadingFailed"
    :message-id="'limits-table-renderer.data-loading'"
  />
  <no-data-message
    v-else-if="!isLoading && isLoadingFailed"
    :title-id="'limits-table-renderer.loading-failed'"
    :message-id="'limits-table-renderer.loading-failed-message'"
    class="limits-table-renderer__no-data-message"
  >
    <button
      class="app__button-raised limits-table-renderer__reload-limits-btn"
      @click="askLimitsReload"
    >
      {{ 'limits-table-renderer.load-limits-btn' | globalize }}
    </button>
  </no-data-message>
</template>

<script>
import { STATS_OPERATION_TYPES } from '@tokend/js-sdk'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

const OPERATION_TYPES_TRANSLATION_ID = {
  [STATS_OPERATION_TYPES.deposit]: 'limits-table-renderer.op-type-deposit',
  [STATS_OPERATION_TYPES.withdraw]: 'limits-table-renderer.op-type-withdraw',
  // eslint-disable-next-line
  [STATS_OPERATION_TYPES.paymentOut]: 'limits-table-renderer.op-type-payment-out',
}

const EVENTS = Object.freeze({
  limitsReloadAsk: 'limits-reload-ask',
})

export default {
  name: 'limits-table-renderer',
  components: {
    Loader,
    NoDataMessage,
  },
  props: {
    limits: { type: Object, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
    isLoadingFailed: { type: Boolean, required: true, default: false },
  },
  data: () => ({
    OPERATION_TYPES_TRANSLATION_ID,
  }),
  methods: {
    askLimitsReload () {
      this.$emit(EVENTS.limitsReloadAsk)
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";

.limits-table-renderer__table-item--inactive {
  color: $col-table-cell-text-inactive;
}

.limits-table-renderer__reload-limits-btn {
  margin-top: 1.6rem;
}

.limits-table-renderer__no-data-message {
  margin-top: 3.2rem;
}

</style>
