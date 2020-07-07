<template>
  <div
    class="readonly-field"
    :class="{ 'readonly-field--error': errorMessage }"
  >
    <div class="readonly-field__content">
      <span class="readonly-field__label">
        {{ label }}
      </span>

      <span class="readonly-field__value">
        {{ value || '&mdash;' }}
      </span>
    </div>

    <transition name="readonly-field__err-transition">
      <p
        v-if="errorMessage"
        class="readonly-field__err-mes">
        {{ errorMessage }}
      </p>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'readonly-field',
  props: {
    label: { type: String, default: 'Label' },
    value: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
  },
}
</script>

<style lang="scss" scoped>
@import 'scss/variables';

.readonly-field__content {
  display: flex;
  justify-content: space-between;
  color: $col-text;
}

.readonly-field__label,
.readonly-field__value {
  font-size: 1.6rem;
}

.readonly-field__err-mes {
  color: $field-color-error;
  margin-top: $field-error-margin-top;
  font-size: $field-error-font-size;
  line-height: $field-error-line-height;
}

.readonly-field__err-transition-enter-active {
  animation:
    readonly-field__err-transition-keyframes
    $field-transition-duration
    ease-in-out;
}

.readonly-field__err-transition-leave-active {
  animation:
    readonly-field__err-transition-keyframes
    $field-transition-duration
    ease-in-out
    reverse;
}

@keyframes readonly-field__err-transition-keyframes {
  from {
    max-height: 0;
    margin-top: 0;
    overflow: hidden;
  }

  to {
    max-height: $field-error-font-size * $field-error-line-height;
    margin-top: $field-error-margin-top;
    overflow: hidden;
  }
}
</style>
