<template>
  <div class="select">
    <div v-if="label" class="select__label">
      {{ label }}
    </div>
    <div
      class="select__selected"
      :class="{ 'select__selected--disabled': disabled }"
      @click="toggleListVisibility()">
      <button class="select__selected-value">
        {{ getLabel(currentValue) }}
      </button>
      <i
        class="select__selected-icon mdi mdi-chevron-down"
        :class="{ 'select__selected-icon--active': isExpanded }"
      />
    </div>
    <div
      class="select__list"
      ref="list"
      :class="{ 'select__list--active': isExpanded }">
      <template v-for="(item, i) in values">
        <button
          class="select__list-item"
          :key="i"
          :class="{
            'select__list-item--selected':
              getValue(selectedValue) === getValue(item)
          }"
          @click="selectItem(item)">
          {{ getLabel(item) }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import SelectFieldMixin from './js/select-field.mixin'

export default {
  name: 'select-field-custom',
  mixins: [SelectFieldMixin]
}
</script>

<style scoped lang="scss">
  @import "./scss/variables";

  .select {
    position: relative;
  }

  .select__selected {
    color: $field-color-text;
    white-space: nowrap;
    font-size: 1.8 * $point;
    display: flex;
    cursor: pointer;
  }

  .select__selected--disabled { opacity: .5; }

  .select__selected-icon {
    will-change: transform;
    color: $field-color-text;
    font-size: 2.2 * $point;
    transition: .2s ease-out;

    &.select__selected-icon--active {
      transform: rotate(-180deg)
    }
  }

  .select__list {
    opacity: 0;
    visibility: hidden;
    transition: .2s ease-out;
    margin-top: -1.0 * $point;
    position: absolute;
    left: 0;
    min-width: 17.0 * $point;
    top: calc(100% + (.4 * #{$point}));
    background-color: $col-dropdown-bg;
    box-shadow: 0 .4 * $point 1.0 * $point 0 rgba(0, 0, 0, .15);
    border-radius: .3 * $point;
    z-index: 5;
    max-height: 24.4 * $point;
    overflow-y: auto;
    padding: .8 * $point 0;
  }

  .select__list--active {
    visibility: visible;
    opacity: 1;
    margin-top: 0;
  }

  .select__list-item {
    padding: .8 * $point 1.6 * $point;
    font-size: 1.6 * $point;
    transition: .15s ease-out;
    cursor: pointer;
    white-space: nowrap;
    border: none;
    display: block;
    width: 100%;
    text-align: left;
    background-color: transparent;

    &:not(.select__list-item--selected):hover {
      background-color: $col-select-field-hover;
    }
  }

  .select__selected-value {
    background-color: transparent;
    border: none;
    color: $field-color-text;
    font-size: 1.8 * $point;
    font-weight: 500;
    cursor: pointer;
  }

  .select__label {
    color: $field-color-unfocused;
    font-size: 1.2 * $point;
  }

  .select__list-item--selected {
    color: $field-color-text;

    background-color: rgba(58, 65, 128, 0.1);
    @include text-font-sizes;
  }
</style>
