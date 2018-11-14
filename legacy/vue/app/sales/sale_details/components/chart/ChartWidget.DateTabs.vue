<template>
  <div class="date-tabs">
    <span class="date-tabs__prefix">
      {{ i18n.trd_chart_tabs_prefix() }}
    </span>

    <button
      class="tab-btn"
      @click="$emit(common.inputEvent, tabs.hour)"
      :class="{ selected: value === tabs.hour }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_hour() }}</span>
    </button>

    <button
      class="tab-btn"
      @click="$emit(common.inputEvent, tabs.day)"
      :class="{ selected: value === tabs.day }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_day() }}</span>
    </button>

    <button
      class="tab-btn"
      @click="$emit(common.inputEvent, tabs.month)"
      :class="{ selected: value === tabs.month }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_month() }}</span>
    </button>

    <button
      class="tab-btn"
      @click="$emit(common.inputEvent, tabs.year)"
      :class="{ selected: value === tabs.year }"
      :disabled="isPending"
    >
      <span class="mobile-hidden">{{ i18n.trd_chart_year() }}</span>
    </button>
  </div>
</template>

<script>
import { commonEvents } from '../../../../../../js/events/common_events'
import { i18n } from '../../../../../../js/i18n/index'

export default {
  name: 'date-tabs',
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
  @import "../../../../../../scss/variables";
  @import "../../../../../../scss/mixins";

  .date-tabs {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
  }

  .date-tabs__prefix {
    white-space: nowrap;
    display: inline-block;
    margin-right: 1 * $point;
    color: $col-text-field-hint;
  }

  .tab-btn {
    padding: 5px 10px;
    margin: 0 3px;
    cursor: pointer;
    letter-spacing: 0.005em;
    position: relative;
    border: none;
    font-size: 12px;
    color: rgba($col-text-field-hint, .6);
    background-color: transparent;
    font-weight: 500;

    &.selected {
      color: $col-text-field-hint;
      font-weight: 700;
    }
  }
</style>
