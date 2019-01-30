<template>
  <div class="switch-field">
    <button
      class="switch-field__switch"
      @click="toggle"
    >
      <span
        class="switch-field__switch-slider"
        :class="{ 'switch-field__switch-slider--enabled': isEnabled }"
      />
    </button>
    <span
      v-if="label"
      class="switch-field__label"
    >
      {{ label }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'switch-field',
  props: {
    isEnabled: { type: Boolean, default: false },
    label: { type: String, default: '' },
  },
  methods: {
    toggle () {
      this.$emit('update:isEnabled', !this.isEnabled)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "scss/variables";

.switch-field {
  display: flex;
  align-items: center;
}

.switch-field__switch {
  position: relative;
  display: inline-block;
  width: 5.3rem;
  height: 2.8rem;

  &-slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $col-switch-field-background;
    border: solid .1rem #c1bfd0;
    border-radius: 3.4rem;

    &:before {
      position: absolute;
      content: "";
      height: 2.2rem;
      width: 2.2rem;
      left: .1rem;
      bottom: .1rem;
      background-color: $col-switch-field-disabled;
      border: solid .1rem darken($col-switch-field-disabled, 10%);
      transition: .4s;
      border-radius: 50%;
    }

    &--enabled:before {
      background-color: $col-switch-field-enabled;
      border: solid .1rem darken($col-switch-field-enabled, 10%);
      transform: translateX(2.5rem);
    }
  }
}

.switch-field__label {
  margin-left: 1rem;
  font-size: 1.6rem;
  color: $col-primary;
}
</style>
