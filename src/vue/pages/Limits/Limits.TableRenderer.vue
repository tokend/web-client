<template>
  <div
    v-if="!isLoadingFailed"
    class="limits-table-renderer__table app__table app__table--with-shadow"
  >
    <table>
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
      <tbody v-if="!isLoading">
        <tr
          v-for="(item, i) in limits"
          :key="`limits-table-row-${i}`"
        >
          <td>
            {{ OPERATION_TYPES_TRANSLATION_ID[item.statsOpType] | globalize }}
          </td>
          <td>
            <template v-if="!item.dailyOut || item.dailyOut === MAX_AMOUNT">
              <span class="limits-table-renderer__value-placeholder">
                {{ 'limits-table-renderer.unlimited-lbl' | globalize }}
              </span>
            </template>
            <template v-else>
              <span class="limits-table-renderer__value">
                {{ item.dailyLeft | formatNumber }}
                /
                {{ item.dailyOut | formatNumber }}
              </span>
            </template>
          </td>
          <td>
            <template v-if="!item.weeklyOut || item.weeklyOut === MAX_AMOUNT">
              <span class="limits-table-renderer__value-placeholder">
                {{ 'limits-table-renderer.unlimited-lbl' | globalize }}
              </span>
            </template>
            <template v-else>
              <span class="limits-table-renderer__value">
                {{ item.weeklyLeft | formatNumber }}
                /
                {{ item.weeklyOut | formatNumber }}
              </span>
            </template>
          </td>
          <td>
            <template v-if="!item.monthlyOut || item.monthlyOut === MAX_AMOUNT">
              <span class="limits-table-renderer__value-placeholder">
                {{ 'limits-table-renderer.unlimited-lbl' | globalize }}
              </span>
            </template>
            <template v-else>
              <span class="limits-table-renderer__value">
                {{ item.monthlyLeft | formatNumber }}
                /
                {{ item.monthlyOut | formatNumber }}
              </span>
            </template>
          </td>
          <td>
            <template v-if="!item.annualOut || item.annualOut === MAX_AMOUNT">
              <span class="limits-table-renderer__value-placeholder">
                {{ 'limits-table-renderer.unlimited-lbl' | globalize }}
              </span>
            </template>
            <template v-else>
              <span>
                {{ item.annualLeft | formatNumber }}
                /
                {{ item.annualOut | formatNumber }}
              </span>
            </template>
          </td>
        </tr>
      </tbody>
      <skeleton-loader-table-body
        v-else
      />
    </table>
  </div>
  <loader
    v-else-if="isLoading && !isLoadingFailed"
    :message-id="'limits-table-renderer.data-loading'"
  />
  <no-data-message
    v-else-if="!isLoading && isLoadingFailed"
    :title="'limits-table-renderer.loading-failed' | globalize"
    :message="'limits-table-renderer.loading-failed-message' | globalize"
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
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'

import config from '../../../config'

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
    SkeletonLoaderTableBody,
  },
  props: {
    limits: { type: Object, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
    isLoadingFailed: { type: Boolean, required: true, default: false },
  },
  data: () => ({
    OPERATION_TYPES_TRANSLATION_ID,
    MAX_AMOUNT: config.MAX_AMOUNT,
  }),
  methods: {
    askLimitsReload () {
      this.$emit(EVENTS.limitsReloadAsk)
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

.limits-table-renderer__value-placeholder {
  color: $col-table-cell-text-inactive;
}

.limits-table-renderer__reload-limits-btn {
  margin-top: 1.6rem;
}

.limits-table-renderer__no-data-message {
  margin-top: 3.2rem;
}
</style>
