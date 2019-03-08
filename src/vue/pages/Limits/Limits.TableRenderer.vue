<template>
  <div
    v-if="!isLoading && !isLoadingFailed"
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
      <tbody>
        <tr v-for="(item, i) in limits" :key="`limits-table-row-${i}`">
          <td>
            {{ OPERATION_TYPES_TRANSLATION_ID[item.statsOpType] | globalize }}
          </td>
          <td>
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.dailyLeft }">
              <template v-if="item.dailyLeft && item.dailyOut !== MAX_AMOUNT">
                {{ item.dailyLeft | formatNumber }}
              </template>
              <template v-else>
                {{ 'limits-table-renderer.not-set-lbl' | globalize }}
              </template>
            </span>
            /
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.dailyOut }">
              <template v-if="item.dailyOut && item.dailyOut !== MAX_AMOUNT">
                {{ item.dailyOut | formatNumber }}
              </template>
              <template v-else>
                {{ 'limits-table-renderer.not-set-lbl' | globalize }}
              </template>
            </span>
          </td>
          <td>
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.weeklyLeft }">
              <template
                v-if="
                  item.weeklyLeft &&
                    item.weeklyOut !== MAX_AMOUNT
                ">
                {{ item.weeklyLeft | formatNumber }}
              </template>
              <template v-else>
                {{ 'limits-table-renderer.not-set-lbl' | globalize }}
              </template>
            </span>
            /
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.weeklyOut }">
              <template v-if="item.weeklyOut && item.weeklyOut !== MAX_AMOUNT">
                {{ item.weeklyOut | formatNumber }}
              </template>
              <template v-else>
                {{ 'limits-table-renderer.not-set-lbl' | globalize }}
              </template>
            </span>
          </td>
          <td>
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.monthlyLeft }">
              <template
                v-if="
                  item.monthlyLeft &&
                    item.monthlyOut !== MAX_AMOUNT">
                {{ item.monthlyLeft | formatNumber }}
              </template>
              <template v-else>
                {{ 'limits-table-renderer.not-set-lbl' | globalize }}
              </template>
            </span>
            /
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.monthlyOut }">
              <template
                v-if="
                  item.monthlyOut &&
                    item.monthlyOut !== MAX_AMOUNT
                ">
                {{ item.monthlyOut | formatNumber }}
              </template>
              <template v-else>
                {{ 'limits-table-renderer.not-set-lbl' | globalize }}
              </template>
            </span>
          </td>
          <td>
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.annualLeft }">
              <template
                v-if="
                  item.annualLeft &&
                    item.annualOut !== MAX_AMOUNT">
                {{ item.annualLeft | formatNumber }}
              </template>
              <template v-else>
                {{ 'limits-table-renderer.not-set-lbl' | globalize }}
              </template>
            </span>
            /
            <!-- eslint-disable-next-line -->
            <span :class="{ 'limits-table-renderer__table-item--inactive': !item.annualOut }">
              <template v-if="item.annualOut && item.annualOut !== MAX_AMOUNT">
                {{ item.annualOut | formatNumber }}
              </template>
              <template v-else>
                {{ 'limits-table-renderer.not-set-lbl' | globalize }}
              </template>
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
