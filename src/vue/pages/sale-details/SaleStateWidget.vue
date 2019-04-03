<template>
  <div class="sale-state-widget">
    <drawer :is-shown.sync="isOverviewDrawerShown">
      <template slot="heading">
        {{ 'sale-details.overview-title' | globalize }}
      </template>

      <sale-overview :sale="sale" />
    </drawer>

    <!-- <chart
      :base-asset="sale.baseAsset"
      :quote-asset="sale.defaultQuoteAsset"
      :show-tabs="false"
      :show-ticks="false"
    /> -->

    <p class="sale-state-widget__invested">
      <!-- eslint-disable-next-line max-len -->
      {{ { value: sale.currentCap, currency: sale.defaultQuoteAsset } | formatMoney }}
    </p>

    <p class="sale-state-widget__funded">
      <!-- eslint-disable-next-line max-len -->
      {{ 'sale-details.funded' | globalize({ funded: sale.currentCap / sale.hardCap }) }}
    </p>

    <div class="sale-state-widget__progress-bar">
      <div
        class="sale-state-widget__progress"
        :style="`width: ${sale.hardCapProgress}%`"
      />
    </div>

    <div class="sale-state-widget__investors">
      <h3>{{ sale.investors }}</h3>
      <p>{{ 'sale-details.investors' | globalize }}</p>
    </div>

    <template v-if="sale.daysToGo >= 0">
      <div class="sale-state-widget__days-to-go">
        <h3>{{ sale.daysToGo }}</h3>
        <p>{{ 'sale-details.days-to-go' | globalize }}</p>
      </div>
    </template>

    <!-- eslint-disable-next-line max-len -->
    <template v-else-if="sale.daysToEnd >= 0 && sale.stateValue === SALE_STATES.open">
      <div class="sale-state-widget__days-to-end">
        <h3>{{ sale.daysToEnd }}</h3>
        <p>{{ 'sale-details.days-to-end' | globalize }}</p>
      </div>
    </template>

    <!-- eslint-disable-next-line max-len -->
    <template v-else-if="sale.daysToEnd >= 0 && sale.stateValue === SALE_STATES.cancelled">
      <div class="sale-state-widget__days-to-end">
        <p>{{ 'sale-details.canceled' | globalize }}</p>
      </div>
    </template>

    <!-- eslint-disable-next-line max-len -->
    <template v-else-if="sale.daysToEnd >= 0 && sale.stateValue === SALE_STATES.closed">
      <div class="sale-state-widget__days-to-end">
        <p>{{ 'sale-details.closed' | globalize }}</p>
      </div>
    </template>

    <template v-else>
      <div class="sale-state-widget__days-after-end">
        <h3>{{ sale.daysAfterEnd }}</h3>
        <p>{{ 'sale-details.days-after-end' | globalize }}</p>
      </div>
    </template>

    <button
      v-ripple
      class="app__button-raised sale-state-widget__overview-btn"
      @click="isOverviewDrawerShown = true"
    >
      {{ 'sale-details.view-details-btn' | globalize }}
    </button>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
// import Chart from '@/vue/common/chart/Chart'

import SaleOverview from './SaleOverview'

import { SaleRecord } from '@/js/records/entities/sale.record'
import { SALE_STATES } from '@/js/const/sale-states'

export default {
  name: 'sale-state-widget',
  components: {
    Drawer,
    // Chart,
    SaleOverview,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    isOverviewDrawerShown: false,
    SALE_STATES,
  }),
}
</script>

<style lang="scss">
@import "~@scss/variables";

.sale-state-widget__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: .3rem;
  background-color: $col-sale-details-progress-bar-bg;

  .sale-state-widget__progress {
    background: $col-sale-details-progress-bar-funded;
    height: 100%;
  }
}

.sale-state-widget__invested {
  font-size: 2.4rem;
  color: $col-sale-details-text-primary;
}

.sale-state-widget__funded {
  font-size: 1.4rem;
  color: $col-sale-details-text-secondary;
}

.sale-state-widget__investors,
.sale-state-widget__days-to-go,
.sale-state-widget__days-after-end,
.sale-state-widget__days-to-end {
  h3 {
    font-size: 2.4rem;
    font-weight: normal;
    color: $col-sale-details-text-primary;
  }

  p {
    font-size: 1.4rem;
    color: $col-sale-details-text-secondary;
  }
}

.sale-state-widget__investors {
  margin-top: 2.4rem;
}

.sale-state-widget__days-to-go,
.sale-state-widget__days-after-end,
.sale-state-widget__days-to-end {
  margin-top: 1.6rem;
}

.sale-state-widget__overview-btn {
  margin-top: 3.2rem;
  max-width: 18rem;
  width: 100%;
}
</style>
