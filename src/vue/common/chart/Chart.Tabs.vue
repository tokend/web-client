<template>
  <div class="chart-tabs">
    <button
      class="chart-tabs__tab app__button-flat"
      @click="$emit(EVENTS.input, tabs.hour)"
      :class="{ 'chart-tabs__tab--selected': value === tabs.hour }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">
        {{ 'chart.hour' | globalize }}
      </span>
    </button>

    <button
      class="chart-tabs__tab app__button-flat"
      @click="$emit(EVENTS.input, tabs.day)"
      :class="{ 'chart-tabs__tab--selected': value === tabs.day }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">
        {{ 'chart.day' | globalize }}
      </span>
    </button>

    <button
      class="chart-tabs__tab app__button-flat"
      @click="$emit(EVENTS.input, tabs.month)"
      :class="{ 'chart-tabs__tab--selected': value === tabs.month }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">
        {{ 'chart.month' | globalize }}
      </span>
    </button>

    <button
      class="chart-tabs__tab app__button-flat"
      @click="$emit(EVENTS.input, tabs.year)"
      :class="{ 'chart-tabs__tab--selected': value === tabs.year }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">
        {{ 'chart.year' | globalize }}
      </span>
    </button>
  </div>
</template>

<script>
const EVENTS = {
  input: 'input',
}
export default {
  name: 'chart-tabs',
  props: {
    value: { type: String, default: '' },
    isPending: { type: Boolean, default: false },
  },
  data: () => ({
    EVENTS,
    tabs: {
      hour: 'hour',
      day: 'day',
      week: 'week',
      month: 'month',
      year: 'year',
      all: 'all',
    },
  }),
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.chart-tabs__tab {
  font-weight: 500;
  color: $col-chart-tabs;

  @media (max-width: $status-message-reposition-bp) {
    padding: 0.8rem;
  }
}

.chart-tabs__tab--selected {
  font-weight: 700;
}
</style>
