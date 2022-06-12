<template>
  <div class="input-field" :class="inputClasses">
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
        :tabindex="isDisabled || isReadonly ? -1 : $attrs.tabindex"
        :type="isPasswordType && isPasswordShown ? 'text' : type"
        :min="min"
        :max="max"
        :disabled="isDisabled || isReadonly"
      />
      <div v-if="isPasswordType || iconName" class="input-field__icon-wrp">
        <button
          type="button"
          v-if="isPasswordType"
          @click="isPasswordShown = !isPasswordShown"
        >
          <icon
            class="input-field__icon"
            :name="isPasswordShown ? $icons.heart : $icons.check"
          />
        </button>
        <icon v-else class="input-field__icon" :name="iconName" />
      </div>
    </div>
    <transition
      name="input-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="input-field__err-msg">
        {{ errorMessage }}
      </span>
    </transition>
  </div>
</template>

<script lang="ts">
import { Icon } from '@/common'

import { BN } from '@/utils/math.util'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  PropType,
  ref,
} from 'vue'
import { ICON_NAMES } from '@/enums'

enum INPUT_TYPES {
  text = 'text',
  password = 'password',
  number = 'number',
}

enum EVENTS {
  updateModelValue = 'update:modelValue',
}

enum SCHEMES {
  iconLeft = 'icon-left',
}

export default defineComponent({
  name: 'input-field',
  components: { Icon },
  props: {
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: ' ' },
    type: {
      type: String as PropType<INPUT_TYPES>,
      default: INPUT_TYPES.text,
    },
    schemes: { type: String as PropType<SCHEMES>, default: '' },
    errorMessage: { type: String, default: '' },
    iconName: { type: String as PropType<ICON_NAMES>, default: '' },
  },
  emits: Object.values(EVENTS),
  setup(props, { emit, attrs }) {
    const uid = getCurrentInstance()?.uid
    const isPasswordShown = ref(false)

    const isNumberType = computed(() => props.type === INPUT_TYPES.number)
    const isPasswordType = computed(() => props.type === INPUT_TYPES.password)

    const min = computed((): string => (attrs?.min as string) || '')
    const max = computed((): string => (attrs?.max as string) || '')

    const isDisabled = computed(() =>
      ['', 'disabled', true].includes(attrs.disabled as string | boolean),
    )

    const isReadonly = computed(() =>
      ['', 'readonly', true].includes(attrs.readonly as string | boolean),
    )

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

    const inputClasses = computed(() => {
      const _schemes = props.schemes
      const classList = [
        ...(_schemes ? [_schemes.split(' ')] : []),
        ...(isDisabled.value ? ['disabled'] : []),
        ...(isReadonly.value ? ['readonly'] : []),
        ...(props.errorMessage ? ['error'] : []),
        ...(props.iconName || isPasswordType ? ['iconed'] : []),
      ]

      return classList.map(el => `input-field--${el}`).join(' ')
    })

    const normalizeRange = (value: string | number): string => {
      let result = value

      if (min.value && new BN(value).compare(min.value) < 0) {
        result = min.value
      } else if (max.value && new BN(value).compare(max.value) > 0) {
        result = max.value
      }

      return result as string
    }

    const setHeightCSSVar = (element: HTMLElement) => {
      element.style.setProperty(
        '--field-error-msg-height',
        `${element.scrollHeight}px`,
      )
    }

    return {
      uid,
      isPasswordShown,

      listeners,
      isDisabled,
      isReadonly,
      min,
      max,
      inputClasses,
      isPasswordType,

      setHeightCSSVar,
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
    opacity: 0.5;
  }
}

.input-field__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @include field-label;

  .input-field--error & {
    color: var(--field-error);
  }
}

.input-field__input-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
}

.input-field__input {
  padding: var(--field-padding);
  transition-property: box-shadow;

  @include field-text;

  @include field-border;

  &::-webkit-input-placeholder {
    @include field-placeholder;
  }

  &::-moz-placeholder {
    @include field-placeholder;
  }

  &:-moz-placeholder {
    @include field-placeholder;
  }

  &:-ms-input-placeholder {
    @include field-placeholder;
  }

  &::placeholder {
    @include field-placeholder;
  }

  &:not(:read-only) {
    box-shadow: inset 0 0 0 toRem(50) var(--app-bg);
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
    border-color: var(--field-error);
  }

  .input-field--iconed & {
    padding-right: calc(var(--field-padding-right) * 3);
  }

  .input-field--icon-left & {
    padding-right: var(--field-padding-right);
    padding-left: calc(var(--field-padding-right) * 3);
  }

  &:not([disabled]):focus {
    box-sizing: border-box;
    box-shadow: 0 0 0 toRem(1.5) var(--primary-main);
    border-color: var(--primary-main);
  }

  &:not([disabled]):not(:focus):hover {
    border-color: var(--primary-light);
  }
}

.input-field__icon-wrp {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  right: calc(var(--field-padding-right) * 3 / 2);
  transform: translate(50%, -50%);

  .input-field--icon-left & {
    right: 0;
    left: calc(var(--field-padding-right) * 3 / 2);
    transform: translate(-50%, -50%);
  }
}

.input-field__icon {
  width: toRem(18);
  height: toRem(18);
}

.input-field__err-msg {
  @include field-error;
}

.input-field__err-msg-transition-enter-active {
  animation: fade-down var(--field-transition-duration);
}

.input-field__err-msg-transition-leave-active {
  animation: fade-down var(--field-transition-duration) reverse;
}

@keyframes fade-down {
  from {
    height: 0;
  }

  to {
    height: var(--field-error-msg-height);
  }
}
</style>
