<template>
  <div
    class="input-field"
    :class="{
      'input-field--error': errorMessage,
      'input-field--disabled': isDisabled,
      'input-field--readonly': isReadonly,
      'input-field--right-align': scheme === SCHEMES.rightAlign,
    }"
  >
    <label v-if="label" :for="`input-field--${uid}`" class="input-field__label">
      {{ label }}
    </label>
    <div class="input-field__input-wrp">
      <input
        class="input-field__input"
        :id="`input-field--${uid}`"
        v-bind="$attrs"
        v-on="listeners"
        :value="modelValue"
        :placeholder="placeholder"
        :tabindex="isDisabled || isReadonly ? -1 : tabIndex"
        :type="type"
        :max="max"
        :disabled="isDisabled || isReadonly"
      />
    </div>
    <transition name="input-field__err-msg-transition">
      <span v-if="errorMessage" class="input-field__err-msg">
        {{ errorMessage }}
      </span>
    </transition>
  </div>
</template>

<script lang="ts">
import { BN } from '@/utils/math.util'
import { computed, defineComponent, getCurrentInstance, PropType } from 'vue'

enum INPUT_TYPES {
  text = 'text',
  number = 'number',
}

enum EVENTS {
  updateModelValue = 'update:modelValue',
}

enum SCHEMES {
  default = 'default',
  rightAlign = 'right-align',
}

export default defineComponent({
  name: 'input-field',
  props: {
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: ' ' },
    tabIndex: { type: Number, default: 0 },
    type: {
      type: String as PropType<INPUT_TYPES>,
      default: INPUT_TYPES.text,
    },
    scheme: { type: String, default: SCHEMES.default },
    errorMessage: { type: String, default: '' },
  },
  emits: Object.values(EVENTS),
  setup(props, { emit, attrs }) {
    const uid = getCurrentInstance()?.uid

    const isNumberType = computed(() => props.type === INPUT_TYPES.number)

    const max = computed((): string => (attrs?.max as string) || '')

    const listeners = computed(() => ({
      input: (event: Event) => {
        const eventTarget = event.target as HTMLInputElement
        if (isNumberType.value) {
          eventTarget.value = normalizeRange(eventTarget.value)
        }
        if (props.modelValue === eventTarget.value) return

        emit(EVENTS.updateModelValue, eventTarget.value)
      },
    }))

    const normalizeRange = (value: string | number): string => {
      let result = value

      if (max.value && new BN(value).compare(max.value) > 0) {
        result = max.value
      }

      return result as string
    }

    const isDisabled = computed(() =>
      ['', 'disabled', true].includes(attrs.disabled as string | boolean),
    )

    const isReadonly = computed(() =>
      ['', 'readonly', true].includes(attrs.readonly as string | boolean),
    )

    return {
      uid,
      listeners,
      isDisabled,
      isReadonly,
      max,
      SCHEMES,
    }
  },
})
</script>

<style lang="scss" scoped>
.input-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    pointer-events: none;
    filter: grayscale(100%);
  }
}

.input-field__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.5rem;
  transition: all var(--field-transition-duration);

  @include field-label;

  .input-field--error & {
    color: var(--field-col-error);
  }
}

.input-field__input-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
}

.input-field__input {
  background: none;
  border: none;
  text-overflow: ellipsis;
  padding: var(--field-padding);

  @include field-text;

  @include field-border(var(--field-col-border));

  &::-webkit-input-placeholder {
    @include placeholder;
  }

  &::-moz-placeholder {
    @include placeholder;
  }

  &:-moz-placeholder {
    @include placeholder;
  }

  &:-ms-input-placeholder {
    @include placeholder;
  }

  &::placeholder {
    @include placeholder;
  }

  &:not(:read-only) {
    box-shadow: inset 0 0 0 3.125rem var(--field-col-bg);
  }

  &:read-only,
  &:disabled {
    cursor: default;
    filter: grayscale(100%);
  }

  // Hide number arrows
  &[type='number'] {
    -moz-appearance: textfield;

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .input-field--error & {
    @include field-border(var(--field-col-error));
  }

  .input-field--right-align & {
    text-align: right;
  }
}

.input-field__err-msg {
  overflow: hidden;
  margin-top: 0.5rem;
  color: var(--field-col-error);
  font-size: 0.625rem;
}

.input-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-error-transition);
}

.input-field__err-msg-transition-leave-active {
  animation: fade-down var(--field-error-transition) reverse;
}

@keyframes fade-down {
  from {
    max-height: 0;
    margin-top: 0;
  }

  to {
    max-height: calc(
      var(--field-error-font-size) * var(--field-error-line-height)
    );
    margin-top: var(--field-error-margin-top);
  }
}
</style>
