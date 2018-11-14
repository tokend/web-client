<template>
  <div class="chart-tabs">
    <button
      class="chart-tabs__tab"
      @click="$emit(common.inputEvent, tabs.hour)"
      :class="{ 'chart-tabs__tab--selected': value === tabs.hour }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_hour() }}</span>
    </button>

    <button
      class="chart-tabs__tab"
      @click="$emit(common.inputEvent, tabs.day)"
      :class="{ 'chart-tabs__tab--selected': value === tabs.day }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_day() }}</span>
    </button>

    <button
      class="chart-tabs__tab"
      @click="$emit(common.inputEvent, tabs.month)"
      :class="{ 'chart-tabs__tab--selected': value === tabs.month }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_month() }}</span>
    </button>

    <button
      class="chart-tabs__tab"
      @click="$emit(common.inputEvent, tabs.year)"
      :class="{ 'chart-tabs__tab--selected': value === tabs.year }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_year() }}</span>
    </button>
  </div>
</template>

<script>
import { commonEvents } from 'L@/js/events/common_events'
import { i18n } from 'L@/js/i18n'

export default {
  name: 'chart-tabs',
  props: {
    value: { type: String, default: '' },
    isPending: { type: Boolean, default: false }
  },

  data () {
    return {
      common: {
        inputEvent: commonEvents.inputEvent
      },
      tabs: {
        hour: 'hour',
        day: 'day',
        week: 'week',
        month: 'month',
        year: 'year',
        all: 'all'
      },
      i18n
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~L@scss/variables";
  @import "~L@scss/mixins";

  .chart-tabs__prefix {
    white-space: nowrap;
    display: inline-block;
    margin-right: 1 * $point;
  }

  .chart-tabs__tab {
    @include button();
    @include button-flat();
    font-weight: 500;
  }

  .chart-tabs__tab--selected {
    font-weight: 700;
  }
</style>
