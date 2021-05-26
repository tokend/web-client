<template>
  <div class="switch-field">
    <button
      class="switch-field__toggle"
      :class="{ 'switch-field__toggle--enabled': value }"
      @click="toggle"
    />
    <span
      v-if="label"
      class="switch-field__label"
    >
      {{ label }}
    </span>
  </div>
</template>

<script>
/**
 * Switch field component represents switch for boolean values.
 *
 * To use it pass your boolean data field as a model.
 *
 * <switch-field v-model="isSwitchEnabled" />
 *
 * As long as `isSwitchEnabled` is `true`, the switch will be enabled.
 */

const EVENTS = {
  input: 'input',
}

export default {
  name: 'switch-field',
  props: {
    value: { type: Boolean, default: false },
    label: { type: String, default: '' },
  },
  methods: {
    toggle () {
      this.$emit(EVENTS.input, !this.value)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'scss/variables';

.switch-field {
  display: flex;
  align-items: center;
}

.switch-field__toggle {
  position: relative;
  display: inline-block;
  width: 5.3rem;
  height: 2.8rem;
  background-color: $col-switch-field-background;
  border: solid 0.1rem $col-switch-field-border;
  border-radius: 3.4rem;

  &:before {
    position: absolute;
    content: '';
    height: 2.2rem;
    width: 2.2rem;
    left: 0.1rem;
    bottom: 0.1rem;
    background-color: $col-switch-field-disabled;
    border: solid 0.1rem $col-switch-field-disabled-border;
    transition: 0.4s;
    border-radius: 50%;
  }

  &--enabled:before {
    background-color: $col-switch-field-enabled;
    border: solid 0.1rem $col-switch-field-enabled-border;
    transform: translateX(2.5rem);
  }
}

.switch-field__label {
  margin-left: 1rem;
  font-size: 1.6rem;
  color: $col-text;
}
</style>
