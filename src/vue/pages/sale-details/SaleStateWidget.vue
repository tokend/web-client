<template>
  <div class="sale-state-widget">
    <p class="sale-state-widget__invested">
      <!-- eslint-disable-next-line max-len -->
      {{ formatMoney({ value: sale.currentCap, currency: sale.defaultQuoteAsset }) }}
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

    <div class="sale-state-widget__invest-form-wrp">
      <h3 class="sale-state-widget__invest-form-title">
        {{ 'sale-details.invest-title' | globalize }}
      </h3>

      <invest-form
        class="sale-state-widget__invest-form"
        :sale="sale"
        @submitted="$emit(EVENTS.saleUpdated)"
        @canceled="$emit(EVENTS.saleUpdated)"
      />
    </div>
  </div>
</template>

<script>
import InvestForm from '@/vue/forms/InvestForm'

import { SaleRecord } from '@/js/records/entities/sale.record'
import { SALE_STATES } from '@/js/const/sale-states'
import { formatMoney } from '@/js/helpers/money-helper'

const EVENTS = {
  saleUpdated: 'sale-updated',
}

export default {
  name: 'sale-state-widget',
  components: {
    InvestForm,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    SALE_STATES,
    EVENTS,
  }),
  setup () {
    return {
      formatMoney,
    }
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

.sale-state-widget__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: 0.3rem;
  background-color: $col-sale-details-progress-bar-bg;
}

.sale-state-widget__progress {
  background: $col-sale-details-progress-bar-funded;
  height: 100%;
}

.sale-state-widget__invested {
  font-size: 2.4rem;
  color: $col-sale-details-text-primary;
}

.sale-state-widget__funded {
  font-size: 1.4rem;
  color: $col-sale-details-text-secondary;
}

/* stylelint-disable selector-nested-pattern */
.sale-state-widget__investors,
.sale-state-widget__days-to-go,
.sale-state-widget__days-after-end,
.sale-state-widget__days-to-end {
  h3 {
    font-size: 2.4rem;
    font-weight: 400;
    color: $col-sale-details-text-primary;
  }

  p {
    font-size: 1.4rem;
    color: $col-sale-details-text-secondary;
  }
}
/* stylelint-enable selector-nested-pattern */

.sale-state-widget__investors {
  margin-top: 2.4rem;
}

.sale-state-widget__days-to-go,
.sale-state-widget__days-after-end,
.sale-state-widget__days-to-end {
  margin-top: 1.6rem;
}

.sale-state-widget__invest-form-wrp {
  margin-top: 3.2rem;
}

.sale-state-widget__invest-form {
  margin-top: 1.2rem;
}
</style>
