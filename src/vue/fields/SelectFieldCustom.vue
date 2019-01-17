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
  mixins: [SelectFieldMixin],
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
    font-size: 1.8rem;
    display: flex;
    cursor: pointer;
  }

  .select__selected--disabled { opacity: .5; }

  .select__selected-icon {
    will-change: transform;
    color: $field-color-text;
    font-size: 2.2rem;
    transition: .2s ease-out;

    &.select__selected-icon--active {
      transform: rotate(-180deg)
    }
  }

  .select__list {
    opacity: 0;
    visibility: hidden;
    transition: .2s ease-out;
    margin-top: -1.0rem;
    position: absolute;
    left: 0;
    min-width: 17.0rem;
    top: calc(100% + .4rem);
    background-color: $col-dropdown-bg;
    box-shadow: 0 .4rem 1.0rem 0 rgba(0, 0, 0, .15);
    border-radius: .3rem;
    z-index: 5;
    max-height: 24.4rem;
    overflow-y: auto;
    padding: .8rem 0;
  }

  .select__list--active {
    visibility: visible;
    opacity: 1;
    margin-top: 0;
  }

  .select__list-item {
    padding: .8rem 1.6rem;
    font-size: 1.6rem;
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
    font-size: 1.8rem;
    font-weight: 500;
    cursor: pointer;
  }

  .select__label {
    color: $field-color-unfocused;
    font-size: 1.2rem;
  }

  .select__list-item--selected {
    color: $field-color-text;

    background-color: rgba(58, 65, 128, 0.1);
    @include text-font-sizes;
  }
</style>
