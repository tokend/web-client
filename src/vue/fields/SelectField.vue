<template>
  <div
    class="select-field"
    :class="{
      'select-field--disabled': disabled,
      'select-field--focused': isExpanded,
      'select-field--label-minimized': selectedValue
    }"
  >
    <template v-if="label">
      <div class="select-field__label">
        {{ label }}
      </div>
    </template>
    <button
      class="select-field__selected"
      :class="{'select-field__selected--focused': isExpanded}"
      :disabled="disabled"
      @click.prevent="toggleListVisibility()"
    >
      <span class="select-field__selected-value">
        {{ getLabel(currentValue) || '&nbsp;' }}
      </span>
      <div>
        <i
          class="mdi mdi-chevron-down select-field__selected-icon"
          :class="{ 'select-field__selected-icon--active': isExpanded }"
        />
      </div>
    </button>
    <div
      class="select-field__list"
      ref="list"
      :class="{ 'select-field__list--active': isExpanded }"
    >
      <button
        v-for="(item, i) in values"
        :key="i"
        class="select-field__list-item"
        :class="{
          'select-field__list-item--selected':
            getValue(selectedValue) === getValue(item)
        }"
        @click.prevent="selectItem(item)"
      >
        {{ getLabel(item) }}
      </button>
    </div>
  </div>
</template>

<script>
import SelectFieldMixin from './js/select-field.mixin'
export default {
  name: 'select-field',
  mixins: [SelectFieldMixin],
}
</script>

<style scoped lang="scss">
@import "scss/variables";

.select-field {
  width: 100%;
  flex: 1;
  position: relative;
}

.select-field__selected {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
  background: none;
  border: none;
  caret-color: $field-color-focused;
  color: $field-color-text;
  padding: $field-input-padding;

  @include material-border(
    $field-color-focused,
    $field-color-unfocused,
    "&.select-field__selected--focused"
  );

  @include text-font-sizes;
}

.select-field__selected-value {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: transparent;
  border: none;
  color: $field-color-text;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
}

.select-field__label {
  position: absolute;
  left: 0;
  top: $field-input-padding-top;
  transition: all $field-transition-duration;
  pointer-events: none;
  color: $field-color-unfocused;

  @include text-font-sizes;
}

.select-field--disabled {
  filter: grayscale(100%);

  & > .select-field__selected {
    cursor: default;

    @include readonly-material-border($field-color-unfocused);

    & > .select-field__selected-value {
      color: $field-color-unfocused;
    }
  }
}

.select-field--focused > .select-field__label {
  color: $field-color-focused;

  @include label-font-sizes;
}

.select-field--label-minimized > .select-field__label {
  top: 0;

  @include label-font-sizes;
}

.select-field__selected-icon {
  margin: 0;
  display: inline-block;
  will-change: transform;
  color: $col-field-icon;
  transition: 0.2s ease-out;
  margin-top: -.2rem;
  width: 1.6rem;
  height: 1.6rem;

  &.select-field__selected-icon--active {
    transform: rotate(-180deg);
  }
}

.select-field__list {
  opacity: 0;
  visibility: hidden;
  transition: 0.2s ease-out;
  margin-top: -1rem;
  position: absolute;
  left: 0;
  width: 100%;
  top: calc(100% + .4rem);
  background-color: $col-dropdown-bg;
  box-shadow: 0 .4rem 1rem 0 rgba(0, 0, 0, 0.15);
  border-radius: .3rem;
  z-index: 5;
  max-height: 24.4rem;
  overflow-y: auto;
  padding: .8rem 0;
}

.select-field__list--active {
  visibility: visible;
  opacity: 1;
  margin-top: 0;
}

.select-field__list-item {
  padding: .8rem 1.6rem;
  font-size: 1.6rem;
  transition: background-color 0.15s ease-out;
  cursor: pointer;
  border: none;
  display: block;
  width: 100%;
  text-align: left;
  background-color: transparent;
  &:not(.select-field__list-item--selected):hover {
    background-color: $col-select-field-hover-background;
  }
}

.select-field__list-item--selected {
  background-color: $col-select-field-selected-background;

  @include text-font-sizes;
}
</style>
